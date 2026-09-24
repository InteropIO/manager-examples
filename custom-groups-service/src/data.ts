import type { Group, User } from '@interopio/manager';

export const GROUP_SERVER_ADMIN = 'GLUE42_SERVER_ADMIN';
export const GROUP_FRONT_OFFICE = 'Front Office';
export const GROUP_TRADER = 'Trader';

export class InMemoryGroupsStore {
  private readonly groups: Group[] = [
    {
      name: GROUP_FRONT_OFFICE,
    },
    {
      name: GROUP_TRADER,
    },
  ];

  public getAll(): Group[] {
    return [...this.groups];
  }

  public get(name: string): Group | undefined {
    return this.groups.find((group) => group.name === name);
  }

  public add(group: Group): Group {
    if (!this.groups.some((existing) => existing.name === group.name)) {
      this.groups.push(group);
    }

    return group;
  }

  public update(group: Group): Group {
    const index = this.groups.findIndex(
      (existing) => existing.name === group.name
    );

    if (index !== -1) {
      this.groups[index] = group;
    }

    return group;
  }

  public addOrUpdate(group: Group): Group {
    const index = this.groups.findIndex(
      (existing) => existing.name === group.name
    );

    if (index !== -1) {
      this.groups[index] = group;
    } else {
      this.groups.push(group);
    }

    return group;
  }

  public remove(name: string): void {
    const index = this.groups.findIndex((group) => group.name === name);

    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }

  public clear(): void {
    this.groups.length = 0;
  }
}

export class InMemoryUsersStore {
  private readonly users: User[] = [
    {
      id: 'number.one@company.xyz',
      email: 'number.one@company.xyz',
      apps: [],
      groups: [GROUP_FRONT_OFFICE],
    },
    {
      id: 'number.two@company.xyz',
      email: 'number.two@company.xyz',
      apps: [],
      groups: [GROUP_TRADER],
    },
    {
      id: 'admin',
      email: 'admin@company.xyz',
      apps: [],
      groups: [GROUP_SERVER_ADMIN],
    },
  ];

  public get(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  public getGroups(id: string): string[] {
    return [...(this.get(id)?.groups ?? [])];
  }

  public addToGroups(id: string, groups: string[]): void {
    const user = this.get(id);

    if (!user) {
      return;
    }

    for (const group of groups) {
      if (!user.groups.includes(group)) {
        user.groups.push(group);
      }
    }
  }

  public removeFromGroups(id: string, groups: string[]): void {
    const user = this.get(id);

    if (!user) {
      return;
    }

    user.groups = user.groups.filter((group) => !groups.includes(group));
  }

  // Drops a group from every user that belonged to it.
  public removeGroupFromAll(name: string): void {
    for (const user of this.users) {
      user.groups = user.groups.filter((group) => group !== name);
    }
  }

  public clearGroups(): void {
    for (const user of this.users) {
      user.groups = [];
    }
  }
}

export const groups = new InMemoryGroupsStore();

export const users = new InMemoryUsersStore();
