import type { Group, User } from '@interopio/manager';

export const GROUP_SERVER_ADMIN = 'GLUE42_SERVER_ADMIN';
export const GROUP_FRONT_OFFICE = 'Front Office';

class InMemoryGroupsStore {
  private groups: Group[] = [
    { name: GROUP_SERVER_ADMIN, expandsTo: [] },
    { name: GROUP_FRONT_OFFICE, expandsTo: [] },
  ];

  public getAll() {
    return this.groups;
  }

  public get(name: string) {
    return this.groups.find((g) => g.name === name);
  }

  public add(group: Group) {
    if (!this.groups.find((g) => g.name === group.name)) {
      this.groups.push(group);
    }

    return group;
  }

  public update(group: Group) {
    const index = this.groups.findIndex((g) => g.name === group.name);
    if (index > -1) {
      this.groups.splice(index, 1, group);
    }

    return group;
  }

  public addOrUpdate(group: Group) {
    const index = this.groups.findIndex((g) => g.name === group.name);
    if (index > -1) {
      this.groups.splice(index, 1, group);
    } else {
      this.groups.push(group);
    }

    return group;
  }

  public remove(name: string) {
    const index = this.groups.findIndex((g) => g.name === name);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
  }
  public clear() {
    this.groups = [];
  }
}

export const groups = new InMemoryGroupsStore();

export const users: User[] = [
  {
    id: 'number.one@company.xyz',
    email: 'number.one@company.xyz',
    apps: [],
    groups: [GROUP_SERVER_ADMIN],
  },
  {
    id: 'number.two@company.xyz',
    email: 'number.two@company.xyz',
    apps: [],
    groups: [GROUP_FRONT_OFFICE],
  },
  {
    id: 'admin',
    email: 'admin@company.xyz',
    apps: [],
    groups: [GROUP_SERVER_ADMIN],
  },
];
