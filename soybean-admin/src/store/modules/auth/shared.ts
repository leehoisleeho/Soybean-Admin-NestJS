import { localStg, sessionStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return localStg.get('token') || sessionStg.get('token') || '';
}

/** Get refresh token */
export function getRefreshToken() {
  return localStg.get('refreshToken') || sessionStg.get('refreshToken') || '';
}

export function setAuthTokens(persistent: boolean, token: string, refreshToken: string) {
  if (persistent) {
    localStg.set('token', token);
    localStg.set('refreshToken', refreshToken);
    sessionStg.remove('token');
    sessionStg.remove('refreshToken');
  } else {
    sessionStg.set('token', token);
    sessionStg.set('refreshToken', refreshToken);
    localStg.remove('token');
    localStg.remove('refreshToken');
  }
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  sessionStg.remove('token');
  sessionStg.remove('refreshToken');
}
