import type {
  DataRequest,
  DataResult,
  Group,
  GroupsFeatures,
  User,
} from '@interopio/manager-api';

import type { GroupsService, AuditBuilder } from '@interopio/manager';

import { groups, users } from './data';

export class MyGroupsService implements GroupsService {
  public getSupportedFeatures(): GroupsFeatures {
    return {
      canAddGroup: true,
      canRemoveGroup: true,
      canAddUserToGroup: true,
      canRemoveUserFromGroup: true,
      canGetAllGroups: true,
      canGetUserGroups: true,
    };
  }

  public async getUserGroups(user: string | User): Promise<string[]> {
    const localUser = this.findUser(user);
    return localUser?.groups ?? [];
  }

  public async getAllGroups(request: DataRequest): Promise<DataResult<Group>> {
    return {
      items: groups.getAll().map((i: string) => ({ name: i })),
      total: groups.getAll().length,
    };
  }

  public async addGroup(name: string, audit: AuditBuilder): Promise<void> {
    groups.add(name);
  }

  public async removeGroup(name: string, audit: AuditBuilder): Promise<void> {
    groups.remove(name);
  }

  public async addUserToGroups(
    user: string,
    groups: string[],
    audit: AuditBuilder
  ): Promise<void> {
    const localUser = this.findUser(user);
    localUser?.groups.push(...groups);
  }

  public async removeUserFromGroups(
    user: string,
    groups: string[],
    audit: AuditBuilder
  ): Promise<void> {
    const localUser = this.findUser(user);
    for (const group of groups) {
      const index = localUser?.groups.indexOf(group);
      if (index && index > -1) {
        localUser?.groups.splice(index, 1);
      }
    }
  }

  public async removeAll(audit: AuditBuilder): Promise<void> {
    groups.clear();
  }

  private findUser(user: string | User) {
    const id = typeof user === 'string' ? user : user.id;
    const localUser = users.find((u: User) => u.id === id);
    return localUser;
  }
}
