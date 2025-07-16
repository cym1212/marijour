import React from 'react';
import { ComponentSkinProps } from './types';
import './login-skin.scss';

// ✅ 프론트엔드 LoginLogic에 맞춘 Component Skin
const LoginSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode,
  utils, 
  app
}) => {
  const { t, cx } = utils;
  
  // ✅ LoginLogic에서 제공하는 데이터와 액션만 사용
  const { 
    formData = {}, 
    loading = false, 
    loginSuccess = false,
    loginError = null,
    validationErrors = {},
    theme = {}
  } = data;
  
  const { handleSubmit, handleChange, handleSignupClick } = actions;
  
  // ✅ 속성 패널에서 설정 가능한 모든 옵션 (문서 가이드 기준)
  const {
    // 기본 설정
    title = '로그인',
    redirectPath = '/',
    
    // 배경 설정
    backgroundType = 'image',
    backgroundUrl = '',
    
    // 색상 설정
    buttonColor = '#007bff',
    titleColor = '#333333',
    labelColor = '#333333',
    inputTextColor = '#333333',
    
    // 기타 옵션
    skin = 'basic'
  } = options;
  
  // ✅ 동적 버튼 색상 설정 (속성 패널 옵션 > 테마 색상 순서로 우선순위)
  const finalButtonColor = buttonColor || theme?.primaryColor || '#007bff';           // 속성 패널 버튼 색상 우선
  const buttonTextColor = '#ffffff';                                                  // 텍스트 색상 (흰색)
  const buttonHoverColor = theme?.primaryHoverColor || finalButtonColor || '#0056b3'; // 호버 색상

  // ✅ 로그인 성공 시 UI
  if (loginSuccess) {
    return (
      <div className="login-skin success">
        <div className="login-container">
          <h2>{t('로그인 성공!')}</h2>
          <p>{t('환영합니다! 잠시 후 페이지가 이동됩니다.')}</p>
        </div>
      </div>
    );
  }

  // ✅ 배경 스타일 설정 (속성 패널 backgroundType 및 backgroundUrl 반영)
  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    };

    switch (backgroundType) {
      case 'image':
        return backgroundUrl ? {
          ...baseStyle,
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {
          ...baseStyle,
          backgroundColor: '#f5f5f5'
        };
      
      case 'video':
        // 비디오 배경은 별도 처리 필요 (향후 구현)
        return {
          ...baseStyle,
          backgroundColor: '#000'
        };
      
      case 'none':
      default:
        return {
          ...baseStyle,
          backgroundColor: 'transparent'
        };
    }
  };

  // ✅ 테마 색상과 속성 패널 색상을 CSS 변수로 설정
  const themeStyles = {
    '--primary-color': finalButtonColor,
    '--secondary-color': app?.theme?.colorset?.secondaryColor || '#FAFAF8',
    '--tertiary-color': app?.theme?.colorset?.tertiaryColor || '#F5BF42',
    '--title-color': titleColor,
    '--label-color': labelColor,
    '--input-text-color': inputTextColor
  } as React.CSSProperties;

  return (
    <div className={cx ? cx('login-skin', loading && 'loading') : `login-skin ${loading ? 'loading' : ''}`} style={{...getBackgroundStyle(), ...themeStyles}}>
      <div className="login-container" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 className="login-title" style={{ 
          color: titleColor,
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: '600'
        }}>{title}</h2>
        
        {/* ✅ 로그인 에러 메시지 표시 */}
        {loginError && (
          <div className="error-message global-error">
            {t(loginError)}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-fields" style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="user_id" style={{
                display: 'block',
                marginBottom: '8px',
                color: labelColor,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {t('아이디')}
              </label>
              <input
                id="user_id"
                type="text"
                className={cx ? cx('form-input', validationErrors.user_id && 'error') : `form-input ${validationErrors.user_id ? 'error' : ''}`}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: validationErrors.user_id ? '1px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '6px',
                  color: inputTextColor,
                  backgroundColor: '#fff',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder={t('아이디를 입력하세요')}
                value={formData.user_id || ''}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
              />
              {validationErrors.user_id && (
                <span className="error-message" style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'block'
                }}>{validationErrors.user_id}</span>
              )}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '8px',
                color: labelColor,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {t('비밀번호')}
              </label>
              <input
                id="password"
                type="password"
                className={cx ? cx('form-input', validationErrors.password && 'error') : `form-input ${validationErrors.password ? 'error' : ''}`}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: validationErrors.password ? '1px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '6px',
                  color: inputTextColor,
                  backgroundColor: '#fff',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder={t('비밀번호를 입력하세요')}
                value={formData.password || ''}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
              {validationErrors.password && (
                <span className="error-message" style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'block'
                }}>{validationErrors.password}</span>
              )}
            </div>
          </div>
          
          <div className="form-buttons">
            <button 
              type="submit" 
              className="button primary" 
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: buttonTextColor,
                backgroundColor: finalButtonColor,
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                marginTop: '10px'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = buttonHoverColor;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = finalButtonColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading ? t('로그인 중...') : t('로그인')}
            </button>
            
            {/* ✅ handleSignupClick 사용 또는 utils.navigate 폴백 */}
            <button 
              type="button" 
              className="button white"
              onClick={handleSignupClick || (() => utils.navigate('/signup'))}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: finalButtonColor,
                backgroundColor: 'transparent',
                border: `2px solid ${finalButtonColor}`,
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                marginTop: '10px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = finalButtonColor;
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = finalButtonColor;
              }}
            >
              {t('회원가입')}
            </button>
          </div>
          
          <div className="form-links">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                utils.navigate('/find-password');
              }}
              className="link"
            >
              {t('비밀번호 찾기')}
            </a>
            <span className="divider"></span>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                utils.navigate('/guest-order-lookup');
              }}
              className="link"
            >
              {t('비회원 주문 조회')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

// 기본 내보내기
export default LoginSkin;