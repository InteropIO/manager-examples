import type { User } from '@interopio/manager-api';

export const GROUP_SERVER_ADMIN = 'GLUE42_SERVER_ADMIN';
export const GROUP_FRONT_OFFICE = 'Front Office';

class InMemoryGroupsStore {
  private groups = [GROUP_SERVER_ADMIN, GROUP_FRONT_OFFICE];

  public getAll() {
    return this.groups;
  }

  public add(name: string) {
    if (this.groups.indexOf(name) === -1) {
      this.groups.push(name);
    }
  }
  public remove(name: string) {
    const index = this.groups.indexOf(name);
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
