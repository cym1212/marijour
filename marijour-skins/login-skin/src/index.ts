import LoginSkin from './LoginSkin';

// ✅ UMD 내보내기 방법 (회원가입 스킨과 동일)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginSkin;
} else {
    (window as any).LoginSkin = LoginSkin;
}

export default LoginSkin;