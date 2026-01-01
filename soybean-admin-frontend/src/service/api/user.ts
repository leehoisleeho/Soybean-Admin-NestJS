import { request } from '../request';

function toOptionalTrimmedString(value: any): string | undefined {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text || undefined;
}

function toOptionalStatusNumber(value: any): 0 | 1 | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === 'string' && value.trim() === '') return undefined;

  const num = Number(value);
  if (Number.isNaN(num)) return undefined;

  if (num === 0) return 0;
  if (num === 1) return 1;
  return undefined;
}

/** get user list */
export function fetchUserList(params?: Api.SystemManage.UserSearchParams) {
  const normalizedParams = params
    ? {
        ...params,
        username: toOptionalTrimmedString(params.username),
        nickname: toOptionalTrimmedString(params.nickname),
        email: toOptionalTrimmedString(params.email),
        phone: toOptionalTrimmedString(params.phone),
        status: (toOptionalStatusNumber(params.status) as any) ?? undefined
      }
    : undefined;

  return request<Api.SystemManage.UserList>({
    url: '/user',
    method: 'get',
    params: normalizedParams
  });
}

/** create user */
export function fetchCreateUser(data: any) {
  const payload = {
    username: toOptionalTrimmedString(data?.username),
    password: toOptionalTrimmedString(data?.password),
    nickname: toOptionalTrimmedString(data?.nickname),
    email: toOptionalTrimmedString(data?.email),
    phone: toOptionalTrimmedString(data?.phone),
    avatar: toOptionalTrimmedString(data?.avatar),
    remark: toOptionalTrimmedString(data?.remark),
    roleIds: Array.isArray(data?.roleIds) ? data.roleIds : undefined,
    status: toOptionalStatusNumber(data?.status)
  };

  return request({
    url: '/user',
    method: 'post',
    data: payload
  });
}

/** update user */
export function fetchUpdateUser(id: string, data: any) {
  const payload = {
    username: toOptionalTrimmedString(data?.username),
    nickname: toOptionalTrimmedString(data?.nickname),
    email: toOptionalTrimmedString(data?.email),
    phone: toOptionalTrimmedString(data?.phone),
    avatar: toOptionalTrimmedString(data?.avatar),
    remark: toOptionalTrimmedString(data?.remark),
    roleIds: Array.isArray(data?.roleIds) ? data.roleIds : undefined,
    status: toOptionalStatusNumber(data?.status)
  };

  return request({
    url: `/user/${id}`,
    method: 'patch',
    data: payload
  });
}

/** delete user */
export function fetchDeleteUser(id: string) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  });
}

/** batch delete user */
export function fetchBatchDeleteUser(ids: string[]) {
  return request({
    url: '/user/batch',
    method: 'delete',
    data: { ids }
  });
}

/** update user status */
export function fetchUpdateUserStatus(id: string, status: number) {
  return request({
    url: `/user/${id}/status`,
    method: 'patch',
    data: { status: Number(status) }
  });
}

/** reset password */
export function fetchResetPassword(id: string, data: any) {
  return request({
    url: `/user/${id}/password`,
    method: 'patch',
    data
  });
}

/** get user detail */
export function fetchUserDetail(id: string) {
  return request<Api.SystemManage.User>({
    url: `/user/${id}`,
    method: 'get'
  });
}

/** assign roles */
export function fetchAssignRoles(id: string, roleIds: string[]) {
  return request({
    url: `/user/${id}/roles`,
    method: 'post',
    data: { roleIds }
  });
}

/** get all roles */
export function fetchAllRoles() {
  return request<Api.SystemManage.RoleList>({
    url: '/role',
    method: 'get',
    params: { page: 1, pageSize: 1000 } // assume not too many roles
  });
}
