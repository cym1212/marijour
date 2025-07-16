import SignUpSkin from './SignUpSkin';

// UMD 모드에서 default export를 전역 변수로 노출
export default SignUpSkin;

// 타입들도 내보냄 (필요시)
export * from './types';

// 전역 변수로 노출 (UMD 환경에서)
if (typeof window !== 'undefined') {
  (window as any).SignUpSkin = SignUpSkin;
}