// 웹빌더 SDK 통합 유틸리티
// 외부 스킨이 웹빌더와 통신하기 위한 인터페이스

declare global {
  interface Window {
    webBuilderStore?: {
      dispatch: (action: any) => any;
      getState: () => any;
      subscribe: (listener: () => void) => () => void;
    };
    webBuilderSDK?: {
      registerSkin: (config: SkinConfig) => void;
      emit: (event: string, data?: any) => void;
      on: (event: string, callback: (data: any) => void) => void;
      off: (event: string, callback: (data: any) => void) => void;
    };
  }
}

interface SkinConfig {
  id: string;
  name: string;
  version: string;
  componentTypes: string[];
  supports: {
    redux: boolean;
    routing: boolean;
    api: boolean;
  };
  entry: {
    component: any;
    styles?: string[];
  };
}

// 웹빌더 SDK 인터페이스
export class WebBuilderSDK {
  private static instance: WebBuilderSDK;
  private isInitialized = false;

  static getInstance(): WebBuilderSDK {
    if (!WebBuilderSDK.instance) {
      WebBuilderSDK.instance = new WebBuilderSDK();
    }
    return WebBuilderSDK.instance;
  }

  // SDK 초기화
  init(): boolean {
    if (this.isInitialized) return true;

    // 웹빌더 환경 체크
    if (typeof window !== 'undefined' && window.webBuilderSDK) {
      this.isInitialized = true;
      console.log('WebBuilder SDK initialized');
      return true;
    }

    console.warn('WebBuilder SDK not found. Running in standalone mode.');
    return false;
  }

  // 스킨 등록
  registerSkin(config: SkinConfig): void {
    if (window.webBuilderSDK) {
      window.webBuilderSDK.registerSkin(config);
    } else {
      console.log('Skin config:', config);
    }
  }

  // Redux 스토어 액세스
  getStore() {
    return window.webBuilderStore || null;
  }

  // 액션 디스패치
  dispatch(action: any) {
    const store = this.getStore();
    if (store) {
      return store.dispatch(action);
    }
    console.log('Redux action (mock):', action);
    return action;
  }

  // 상태 조회
  getState() {
    const store = this.getStore();
    if (store) {
      return store.getState();
    }
    // Mock 상태 반환
    return {
      auth: {
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
        token: null,
      },
      withcookie: {
        data: {},
        isLoaded: false,
      },
    };
  }

  // 이벤트 발생
  emit(event: string, data?: any): void {
    if (window.webBuilderSDK) {
      window.webBuilderSDK.emit(event, data);
    } else {
      console.log(`Event emitted: ${event}`, data);
    }
  }

  // 이벤트 리스너 등록
  on(event: string, callback: (data: any) => void): void {
    if (window.webBuilderSDK) {
      window.webBuilderSDK.on(event, callback);
    } else {
      console.log(`Event listener registered: ${event}`);
    }
  }

  // 이벤트 리스너 제거
  off(event: string, callback: (data: any) => void): void {
    if (window.webBuilderSDK) {
      window.webBuilderSDK.off(event, callback);
    }
  }

  // 웹빌더 환경 체크
  isWebBuilderEnvironment(): boolean {
    return !!(window.webBuilderSDK || window.webBuilderStore);
  }

  // API 호출 (웹빌더 프록시 사용)
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    // 웹빌더 환경에서는 API 프록시를 통해 호출
    if (this.isWebBuilderEnvironment()) {
      // 실제 웹빌더에서는 CORS나 인증을 자동으로 처리
      return fetch(endpoint, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    }

    // 개발 환경에서는 직접 호출
    return fetch(endpoint, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
}

// 싱글톤 인스턴스 내보내기
export const webBuilderSDK = WebBuilderSDK.getInstance();

// 스킨 등록 헬퍼 함수
export const registerLoginSkin = (component: any) => {
  const config: SkinConfig = {
    id: 'login-skin',
    name: 'Login Skin',
    version: '1.0.0',
    componentTypes: ['login', 'auth'],
    supports: {
      redux: true,
      routing: true,
      api: true,
    },
    entry: {
      component,
      styles: ['./login-skin.css'],
    },
  };

  webBuilderSDK.init();
  webBuilderSDK.registerSkin(config);
};

export type { SkinConfig };