import {
  DataRequest,
  GroupsFeatures,
  User,
  GroupsService,
  AuditBuilder,
  GroupDataResult,
  Group,
} from '@interopio/manager';

import { groups, users } from './data.js';

export class MyGroupsService implements GroupsService {
  public getSupportedFeatures(): GroupsFeatures {
    return {
      canAddGroup: true,
      canRemoveGroup: true,
      canAddUserToGroup: true,
      canRemoveUserFromGroup: true,
      canGetAllGroups: true,
      canGetUserGroups: true,
      canGetGroup: true,
      canUpdateGroup: true,
      canAddOrUpdateGroup: true,
    };
  }

  public async getGroup(name: string): Promise<Group | undefined> {
    return groups.get(name);
  }

  public async updateGroup(group: Group, audit: AuditBuilder): Promise<Group> {
    return groups.update(group);
  }

  public async addOrUpdateGroup(
    group: Group,
    audit: AuditBuilder
  ): Promise<Group> {
    return groups.addOrUpdate(group);
  }

  public async getUserGroups(user: string | User): Promise<string[]> {
    const localUser = this.findUser(user);
    return localUser?.groups ?? [];
  }

  public async getAllGroups(request: DataRequest): Promise<GroupDataResult> {
    const items = groups.getAll();
    return {
      items,
      total: items.length,
    };
  }

  public async addGroup(group: Group, audit: AuditBuilder): Promise<Group> {
    return groups.add(group);
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
