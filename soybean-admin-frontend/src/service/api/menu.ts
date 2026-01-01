import { request } from '../request';

function toOptionalNumber(value: any): number | undefined {
  if (value === null || value === undefined) return undefined;

  const num = Number(value);

  if (Number.isNaN(num)) return undefined;

  return num;
}

function toOptionalBinary(value: any): 0 | 1 | undefined {
  if (value === null || value === undefined) return undefined;

  return value ? 1 : 0;
}

function buildMenuPayload(data: any) {
  return {
    parentId: data?.parentId || undefined,
    name: data?.name,
    path: data?.path || undefined,
    component: data?.component || undefined,
    icon: data?.icon || undefined,
    permission: data?.permission || undefined,
    sort: toOptionalNumber(data?.sort),
    status: toOptionalNumber(data?.status),
    visible: toOptionalBinary(data?.visible) ?? 0,
    remark: data?.remark || undefined,
    type: toOptionalNumber(data?.type)
  };
}

/** get menu list */
export function fetchMenuList(params?: any) {
  return request<Api.SystemManage.MenuList>({
    url: '/menu',
    method: 'get',
    params
  });
}

/** get menu tree */
export function fetchMenuTree() {
  return request<Api.SystemManage.MenuList>({
    url: '/menu/tree',
    method: 'get'
  });
}

/** get menu detail */
export function fetchMenuDetail(id: string) {
  return request<Api.SystemManage.Menu>({
    url: `/menu/${id}`,
    method: 'get'
  });
}

/** create menu */
export function fetchCreateMenu(data: any) {
  return request({
    url: '/menu',
    method: 'post',
    data: buildMenuPayload(data)
  });
}

/** update menu */
export function fetchUpdateMenu(id: string, data: any) {
  return request({
    url: `/menu/${id}`,
    method: 'patch',
    data: buildMenuPayload(data)
  });
}

/** delete menu */
export function fetchDeleteMenu(id: string) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  });
}

/** batch delete menu */
export function fetchBatchDeleteMenu(ids: string[]) {
  return request({
    url: '/menu/batch',
    method: 'delete',
    data: { ids }
  });
}
