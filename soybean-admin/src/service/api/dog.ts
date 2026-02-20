import { request } from '../request';

/** get dog list */
export function fetchDogList(params?: Api.Dog.DogSearchParams) {
  return request<Api.Dog.DogInfo[]>({
    url: '/dog',
    method: 'get',
    params
  });
}

/** create dog */
export function fetchCreateDog(data: Partial<Api.Dog.DogInfo>) {
  return request({
    url: '/dog',
    method: 'post',
    data
  });
}

/** update dog */
export function fetchUpdateDog(data: Partial<Api.Dog.DogInfo> & { id: string }) {
  return request({
    url: `/dog/${data.id}`,
    method: 'patch',
    data
  });
}

/** delete dog */
export function fetchDeleteDog(id: string) {
  return request({
    url: `/dog/${id}`,
    method: 'delete'
  });
}

/** update dog status */
export function fetchUpdateDogStatus(id: string, status: Api.Dog.Status) {
  return request({
    url: `/dog/${id}/status`,
    method: 'patch',
    data: { status }
  });
}
