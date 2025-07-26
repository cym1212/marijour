import React from 'react';

// 스타일 import
import './login-skin-scoped.css';

// ComponentSkinProps 인터페이스
interface ComponentSkinProps {
    data?: {
        // 폼 상태
        formData?: {
            user_id: string;
            password: string;
        };
        validationErrors?: {
            user_id?: string;
            password?: string;
        };
        loading?: boolean;
        loginSuccess?: boolean;
        loginError?: string | null;
        
        // 테마 및 전역 상태
        theme?: any;
        withcookieData?: any;
        isUserLoggedIn?: boolean;
        isAdminLoggedIn?: boolean;
        
        // 컴포넌트 설정
        redirectUrl?: string;
        backgroundType?: 'none' | 'image' | 'video';
        backgroundUrl?: string;
        title?: string;
        buttonColor?: string;
        titleColor?: string;
        labelColor?: string;
        inputTextColor?: string;
        style?: React.CSSProperties;
        className?: string;
        
        // 에디터 모드
        isEditor?: boolean;
        isPreview?: boolean;
    };
    
    actions?: {
        handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSubmit?: (e: React.FormEvent) => void;
        handleSignupClick?: () => void;
    };
    
    options?: any;
    mode?: 'production' | 'preview' | 'editor';
    
    utils?: {
        t?: (key: string) => string;
        navigate?: (path: string) => void;
        formatCurrency?: (amount: number, currency?: string) => string;
        formatDate?: (date: string | Date, format?: string) => string;
        getAssetUrl?: (path: string) => string;
        cx?: (...classes: (string | undefined | null | false)[]) => string;
    };
    
    app?: {
        user?: any | null;
        settings?: Record<string, any>;
        theme?: any;
        company?: {
            id: number;
        };
    };
    
    editor?: {
        isSelected?: boolean;
        onSelect?: () => void;
        onEdit?: () => void;
        onDelete?: () => void;
        dragHandleProps?: any;
    };
}

/**
 * LoginSkin 컴포넌트 - 로그인 페이지 UMD 버전
 */
export function Login(props?: ComponentSkinProps) {
    // props 또는 기본값 사용
    const data = props?.data || {};
    const actions = props?.actions || {};
    const utils = props?.utils || {};
    
    // data에서 필요한 값 추출
    const formData = data.formData || { user_id: '', password: '' };
    const validationErrors = data.validationErrors || {};
    const loading = data.loading || false;
    const loginSuccess = data.loginSuccess || false;
    const loginError = data.loginError || null;
    const theme = data.theme || props?.app?.theme || {};
    const title = data.title || '로그인';
    const backgroundType = data.backgroundType || 'none';
    const backgroundUrl = data.backgroundUrl || '';
    const titleColor = data.titleColor || '#333';
    const labelColor = data.labelColor || '#666';
    const inputTextColor = data.inputTextColor || '#333';
    const buttonColor = data.buttonColor || theme?.primary || '#4A5578';
    const style = data.style || {};
    
    // utils 함수들
    const t = utils.t || ((key: string) => key);
    const navigate = utils.navigate || ((path: string) => { window.location.href = path; });
    const cx = utils.cx || ((...classes: any[]) => classes.filter(Boolean).join(' '));
    
    // actions 함수들
    const handleChange = actions.handleChange || ((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Input changed:', e.target.name, e.target.value);
    });
    
    const handleSubmit = actions.handleSubmit || ((e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login form submitted');
    });
    
    const handleSignupClick = actions.handleSignupClick || (() => {
        navigate('/signup');
    });
    
    // 로그인 성공 시 표시
    if (loginSuccess) {
        return (
            <div className="login-skin-container">
                <div className="login-skin-success">
                    <p>{t('로그인되었습니다. 잠시 후 이동합니다...')}</p>
                </div>
            </div>
        );
    }
    
    // 배경 스타일 처리
    const containerStyle: React.CSSProperties = {
        ...style,
        backgroundImage: backgroundType === 'image' && backgroundUrl ? 
            `url(${backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div className="login-skin-container" style={containerStyle}>
            {/* 비디오 배경 */}
            {backgroundType === 'video' && backgroundUrl && (
                <video className="login-skin-background-video" autoPlay loop muted playsInline>
                    <source src={backgroundUrl} type="video/mp4" />
                    {t('브라우저가 비디오 태그를 지원하지 않습니다.')}
                </video>
            )}
            
            {/* 배경 오버레이 */}
            {(backgroundType === 'image' || backgroundType === 'video') && backgroundUrl && (
                <div className="login-skin-overlay"></div>
            )}
            
            <section className="login-skin-wrapper">
                <div className="login-skin-title">
                    <h2 style={{ color: titleColor }}>{title}</h2>
                </div>
                <form className="login-skin-form" onSubmit={handleSubmit}>
                    <div className="login-skin-input-group">
                        {/* 아이디 입력 */}
                        <div className={cx('login-skin-form-field', validationErrors.user_id && 'error')}>
                            <label htmlFor="user_id" style={{ color: labelColor }}>
                                {t('아이디')}
                            </label>
                            <input
                                type="text"
                                id="user_id"
                                name="user_id"
                                className="login-skin-input"
                                placeholder={t('아이디를 입력하세요')}
                                value={formData.user_id}
                                onChange={handleChange}
                                style={{ color: inputTextColor }}
                                required
                            />
                            {validationErrors.user_id && (
                                <span className="login-skin-error-message">
                                    {validationErrors.user_id}
                                </span>
                            )}
                        </div>
                        
                        {/* 비밀번호 입력 */}
                        <div className={cx('login-skin-form-field', validationErrors.password && 'error')}>
                            <label htmlFor="password" style={{ color: labelColor }}>
                                {t('비밀번호')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="login-skin-input"
                                placeholder={t('비밀번호를 입력하세요')}
                                value={formData.password}
                                onChange={handleChange}
                                style={{ color: inputTextColor }}
                                required
                            />
                            {validationErrors.password && (
                                <span className="login-skin-error-message">
                                    {validationErrors.password}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* 로그인 에러 메시지 */}
                    {loginError && (
                        <div className="login-skin-login-error">
                            {loginError}
                        </div>
                    )}
                    
                    <div className="login-skin-button-group">
                        <button 
                            type="submit" 
                            className="login-skin-button login-skin-button-primary"
                            style={{ backgroundColor: buttonColor }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="login-skin-spinner"></span>
                                    {t('로그인 중...')}
                                </>
                            ) : (
                                t('로그인')
                            )}
                        </button>
                        <button 
                            type="button" 
                            className="login-skin-button login-skin-button-white"
                            onClick={handleSignupClick}
                        >
                            {t('회원가입')}
                        </button>
                    </div>
                    
                    {/*<div className="login-skin-links">*/}
                    {/*    <a */}
                    {/*        href="#" */}
                    {/*        className="login-skin-link"*/}
                    {/*        onClick={(e) => {*/}
                    {/*            e.preventDefault();*/}
                    {/*            navigate('/find-password');*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        {t('비밀번호 찾기')}*/}
                    {/*    </a>*/}
                    {/*    <span className="login-skin-divider"></span>*/}
                    {/*    <a */}
                    {/*        href="#" */}
                    {/*        className="login-skin-link"*/}
                    {/*        onClick={(e) => {*/}
                    {/*            e.preventDefault();*/}
                    {/*            navigate('/guest-order-lookup');*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        {t('비회원 주문 조회')}*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </form>
            </section>
        </div>
    );
}

export default Login;