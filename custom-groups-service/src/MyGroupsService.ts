import type {
  AuditBuilder,
  DataRequest,
  Group,
  GroupDataResult,
  GroupsFeatures,
  GroupsService,
  User,
} from '@interopio/manager';

import { groups, users } from './data.js';

export class MyGroupsService implements GroupsService {
  // Declares which operations this implementation supports.
  public getSupportedFeatures(): GroupsFeatures {
    return {
      canGetUserGroups: true,
      canGetAllGroups: true,
      canGetGroup: true,
      canAddGroup: true,
      canUpdateGroup: true,
      canAddOrUpdateGroup: true,
      canRemoveGroup: true,
      canAddUserToGroup: true,
      canRemoveUserFromGroup: true,
    };
  }

  // ⚠️ io.Manager authorizes each request against the groups returned here - apart from the
  // admin rights granted through `auth_exclusive_users`, this decides what a user can access.
  public async getUserGroups(user: string | User): Promise<string[]> {
    const id = typeof user === 'string' ? user : user.id;

    return users.getGroups(id);
  }

  public async getAllGroups(_request?: DataRequest): Promise<GroupDataResult> {
    const items = groups.getAll();

    return {
      items,
      total: items.length,
    };
  }

  public async getGroup(name: string): Promise<Group | undefined> {
    return groups.get(name);
  }

  public async addGroup(group: Group, _audit: AuditBuilder): Promise<Group> {
    return groups.add(group);
  }

  public async updateGroup(group: Group, _audit: AuditBuilder): Promise<Group> {
    return groups.update(group);
  }

  public async addOrUpdateGroup(
    group: Group,
    _audit: AuditBuilder
  ): Promise<Group> {
    return groups.addOrUpdate(group);
  }

  public async removeGroup(name: string, _audit: AuditBuilder): Promise<void> {
    groups.remove(name);
    users.removeGroupFromAll(name);
  }

  public async addUserToGroups(
    user: string,
    groups: string[],
    _audit: AuditBuilder
  ): Promise<void> {
    users.addToGroups(user, groups);
  }

  public async removeUserFromGroups(
    user: string,
    groups: string[],
    _audit: AuditBuilder
  ): Promise<void> {
    users.removeFromGroups(user, groups);
  }

  public async removeAll(_audit: AuditBuilder): Promise<void> {
    groups.clear();
    users.clearGroups();
  }
}
