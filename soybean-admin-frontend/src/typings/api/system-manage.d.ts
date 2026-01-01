declare namespace Api {
  namespace SystemManage {
    /** user status */
    type UserStatus = '1' | '0';

    /** common fields for all system entities */
    interface SystemCommonFields {
      /** record id */
      id: string;
      /** record create time */
      createdAt: string;
      /** record update time */
      updatedAt: string;
      /** record status */
      status: UserStatus | null;
    }

    /** user */
    interface User extends SystemCommonFields {
      /** user name */
      username: string;
      /** user nickname */
      nickname: string;
      /** user email */
      email: string;
      /** user phone */
      phone: string;
      /** user avatar */
      avatar: string;
      /** user remark */
      remark: string;
      /** user roles */
      roles: Role[];
    }

    /** user search params */
    interface UserSearchParams {
      page?: number;
      pageSize?: number;
      username?: string | null;
      nickname?: string | null;
      status?: UserStatus | null;
      email?: string | null;
      phone?: string | null;
    }

    /** user list */
    interface UserList {
      records: User[];
      total: number;
      current: number;
      size: number;
    }

    /** role */
    interface Role extends SystemCommonFields {
      /** role name */
      name: string;
      /** role code */
      code: string;
      /** role sort */
      sort: number;
      /** role remark */
      remark: string;
    }

    /** role search params */
    interface RoleSearchParams {
      page?: number;
      pageSize?: number;
      name?: string | null;
      code?: string | null;
      status?: UserStatus | null;
    }

    /** role list */
    interface RoleList {
      records: Role[];
      total: number;
      current: number;
      size: number;
    }

    /** menu */
    interface Menu extends SystemCommonFields {
      /** parent menu id */
      parentId: string | null;
      /** menu name */
      name: string;
      /** menu type */
      type: 1 | 2 | 3;
      /** menu path */
      path: string | null;
      /** menu component */
      component: string | null;
      /** menu icon */
      icon: string | null;
      /** menu sort */
      sort: number;
      /** menu visible */
      visible: 0 | 1;
      /** menu permission */
      permission: string | null;
      /** menu remark */
      remark: string | null;
      /** children menu */
      children?: Menu[];
    }

    /** menu list */
    interface MenuList {
      records: Menu[];
      total: number;
      current: number;
      size: number;
    }
  }
}
