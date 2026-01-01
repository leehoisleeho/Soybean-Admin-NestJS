import { request } from '../request';

/** get role list */
export function fetchRoleList(params?: Api.SystemManage.RoleSearchParams) {
  const normalizedParams = params
    ? {
        ...params,
        name: params.name || undefined,
        code: params.code || undefined,
        status: params.status === null ? undefined : params.status
      }
    : undefined;

  return request<Api.SystemManage.RoleList>({
    url: '/role',
    method: 'get',
    params: normalizedParams
  });
}

/** create role */
export function fetchCreateRole(data: any) {
  const payload = {
    name: data?.name,
    code: data?.code,
    sort: data?.sort === null || data?.sort === undefined ? undefined : Number(data.sort),
    status: data?.status === null || data?.status === undefined ? undefined : Number(data.status),
    remark: data?.remark || undefined
  };

  return request({
    url: '/role',
    method: 'post',
    data: payload
  });
}

/** update role */
export function fetchUpdateRole(id: string, data: any) {
  const payload = {
    name: data?.name,
    code: data?.code,
    sort: data?.sort === null || data?.sort === undefined ? undefined : Number(data.sort),
    status: data?.status === null || data?.status === undefined ? undefined : Number(data.status),
    remark: data?.remark || undefined
  };

  return request({
    url: `/role/${id}`,
    method: 'patch',
    data: payload
  });
}

/** update role status */
export function fetchUpdateRoleStatus(id: string, status: Api.SystemManage.UserStatus) {
  return request({
    url: `/role/${id}`,
    method: 'patch',
    data: { status: Number(status) }
  });
}

/** delete role */
export function fetchDeleteRole(id: string) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  });
}

/** batch delete role */
export function fetchBatchDeleteRole(ids: string[]) {
  return request({
    url: '/role/batch',
    method: 'delete',
    data: { ids }
  });
}

/** get role menu ids */
export function fetchRoleMenuIds(id: string) {
  return request<Api.SystemManage.Menu[]>({
    url: `/role/${id}/menus`,
    method: 'get'
  });
}

/** assign menus to role */
export function fetchAssignMenusToRole(id: string, menuIds: string[]) {
  return request({
    url: `/role/${id}/menus`,
    method: 'post',
    data: { menuIds }
  });
}

/** get all menus (tree) */
export function fetchAllMenuTree() {
  return request<Api.SystemManage.MenuList>({
    url: '/menu/tree',
    method: 'get'
  });
}
