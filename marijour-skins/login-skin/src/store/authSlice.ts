// Redux Toolkit을 사용한 auth slice
// 웹빌더에서 사용할 수 있도록 설계됨
import { LoginCredentials } from '../types';

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: AuthState['user'];
  token?: string;
  redirectUrl?: string;
}

// 초기 상태
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  token: null,
};

// Action types
export const AUTH_ACTIONS = {
  LOGIN_START: 'auth/loginStart',
  LOGIN_SUCCESS: 'auth/loginSuccess',
  LOGIN_FAILURE: 'auth/loginFailure',
  LOGOUT: 'auth/logout',
  CLEAR_ERROR: 'auth/clearError',
  SET_USER: 'auth/setUser',
} as const;

// Action creators
export const authActions = {
  loginStart: () => ({ type: AUTH_ACTIONS.LOGIN_START }),
  
  loginSuccess: (payload: { user: AuthState['user']; token: string }) => ({
    type: AUTH_ACTIONS.LOGIN_SUCCESS,
    payload,
  }),
  
  loginFailure: (error: string) => ({
    type: AUTH_ACTIONS.LOGIN_FAILURE,
    payload: { error },
  }),
  
  logout: () => ({ type: AUTH_ACTIONS.LOGOUT }),
  
  clearError: () => ({ type: AUTH_ACTIONS.CLEAR_ERROR }),
  
  setUser: (user: AuthState['user']) => ({
    type: AUTH_ACTIONS.SET_USER,
    payload: { user },
  }),
};

// Reducer
export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        token: null,
        error: null,
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
      
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: !!action.payload.user,
      };
      
    default:
      return state;
  }
};

// 비동기 액션 (웹빌더에서 사용)
export const loginUser = (credentials: LoginCredentials) => {
  return async (dispatch: any, getState: any) => {
    dispatch(authActions.loginStart());
    
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
  };
};

// 셀렉터
export const authSelectors = {
  selectAuth: (state: any) => state.auth || initialState,
  selectUser: (state: any) => state.auth?.user || null,
  selectIsLoggedIn: (state: any) => state.auth?.isLoggedIn || false,
  selectIsLoading: (state: any) => state.auth?.isLoading || false,
  selectError: (state: any) => state.auth?.error || null,
  selectToken: (state: any) => state.auth?.token || null,
};

export type { AuthState, LoginResponse };