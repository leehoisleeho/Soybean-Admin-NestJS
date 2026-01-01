import { useAuthStore } from '@/store/modules/auth';
import { localStg, sessionStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = localStg.get('token') || sessionStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/** refresh token */
async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const localRefreshToken = localStg.get('refreshToken');
  const sessionRefreshToken = sessionStg.get('refreshToken');
  const rToken = localRefreshToken || sessionRefreshToken || '';
  const { error, data } = await fetchRefreshToken(rToken);
  if (!error) {
    const persistent = Boolean(localRefreshToken);
    if (persistent) {
      localStg.set('token', data.token);
      localStg.set('refreshToken', data.refreshToken);
    } else {
      sessionStg.set('token', data.token);
      sessionStg.set('refreshToken', data.refreshToken);
    }
    return true;
  }

  resetStore();

  return false;
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenPromise) {
    state.refreshTokenPromise = handleRefreshToken();
  }

  const success = await state.refreshTokenPromise;

  setTimeout(() => {
    state.refreshTokenPromise = null;
  }, 1000);

  return success;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
