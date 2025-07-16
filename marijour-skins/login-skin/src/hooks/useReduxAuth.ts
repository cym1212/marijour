import { useCallback } from 'react';
import { LoginCredentials, LoginResponse, authSelectors, loginUser, authActions } from '../store/authSlice';

// 웹빌더 Redux store에 연결하기 위한 hook
// 실제 웹빌더에서는 이 부분이 SDK를 통해 자동으로 처리됨

interface UseReduxAuthReturn {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
  user: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useReduxAuth = (): UseReduxAuthReturn => {
  // 웹빌더에서는 이 부분이 실제 Redux store에 연결됨
  // 현재는 mock 구현
  const dispatch = (action: any) => {
    // 웹빌더 SDK를 통해 dispatch 될 예정
    console.log('Redux Action:', action);
    
    // 실제 웹빌더에서는:
    // return window.webBuilderStore?.dispatch(action);
  };
  
  const getState = () => {
    // 웹빌더 SDK를 통해 state 조회 될 예정
    // 실제 웹빌더에서는:
    // return window.webBuilderStore?.getState();
    return {
      auth: {
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
        token: null,
      }
    };
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Redux thunk action 실행
    if (typeof loginUser === 'function') {
      const thunk = loginUser(credentials);
      if (typeof thunk === 'function') {
        return await thunk(dispatch, getState);
      }
    }
    
    // Fallback: 직접 API 호출
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      // 성공 시 Redux 상태 업데이트
      dispatch(authActions.loginSuccess({
        user: data.user,
        token: data.token,
      }));

      return {
        success: true,
        message: data.message || '로그인 성공',
        user: data.user,
        token: data.token,
        redirectUrl: data.redirectUrl || '/',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
      
      dispatch(authActions.loginFailure(errorMessage));
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  const logout = useCallback(() => {
    dispatch(authActions.logout());
  }, []);

  const clearError = useCallback(() => {
    dispatch(authActions.clearError());
  }, []);

  // 현재 상태 조회
  const state = getState();
  const authState = authSelectors.selectAuth(state);

  return {
    login,
    logout,
    clearError,
    user: authState.user,
    isLoggedIn: authState.isLoggedIn,
    isLoading: authState.isLoading,
    error: authState.error,
  };
};