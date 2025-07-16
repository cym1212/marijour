# Marijour External Skin

Withcookie 웹빌더를 위한 Marijour 외부 스킨입니다.

## 🚀 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 http://localhost:3001 에서 확인할 수 있습니다.

### 3. 프로덕션 빌드
```bash
npm run build
```

빌드 결과물:
- `dist/marijour-skin.umd.js` - JavaScript 파일
- `dist/marijour-skin.css` - CSS 파일

## 📋 주요 기능

- ✅ **ExternalSkinProps 인터페이스 사용** - Withcookie 표준 인터페이스
- ✅ **동적 데이터 바인딩** - 회사 정보, 메뉴, 사용자 정보 등
- ✅ **테마 색상 지원** - CSS 변수를 통한 동적 색상 변경
- ✅ **로그인 상태 처리** - 로그인/비로그인 상태별 UI
- ✅ **메뉴 필터링** - is_logged, is_not_logged 속성 지원
- ✅ **장바구니 연동** - 쇼핑몰 기능 지원
- ✅ **반응형 디자인** - 모바일/데스크톱 대응
- ✅ **메가메뉴** - 다단계 메뉴 구조 지원
- ✅ **비즈니스 메뉴** - B2B 기능 지원

## 🎨 커스터마이징

### 색상 변경
`src/styles/main.scss` 파일에서 CSS 변수 수정:
```scss
:root {
  --primary-color: var(--theme-primary, #89a1be);
  --secondary-color: var(--theme-secondary, #313AB9);
}
```

### 레이아웃 수정
각 컴포넌트 파일에서 구조 변경 가능:
- `src/components/Header.tsx` - 헤더
- `src/components/Footer.tsx` - 푸터
- `src/components/Navigation/` - 네비게이션

## 🔧 스킨 등록

메인 프로젝트에서 스킨 등록:
```javascript
import { registerExternalLayout } from './layouts/ExternalLayoutLoader';

registerExternalLayout({
  id: 'marijour-skin',
  name: 'Marijour 스킨',
  description: '깔끔하고 모던한 쇼핑몰 스킨',
  version: '1.0.0',
  author: 'Your Name',
  umdUrl: 'https://your-cdn.com/marijour-skin.umd.js',
  cssUrls: ['https://your-cdn.com/marijour-skin.css'],
  globalName: 'MarijouirSkin'
});
```

## 📌 중요 사항

1. **globalName 일치**: webpack.config.js, src/index.tsx, 등록 시 동일해야 함
2. **layout.children 사용**: 페이지 컨텐츠는 반드시 `layout.children` 사용
3. **폰트 파일**: 빌드 시 fonts 폴더에 포함됨

## 🐛 문제 해결

### 스킨이 로드되지 않음
- 브라우저 콘솔에서 에러 확인
- Network 탭에서 파일 로드 확인
- globalName이 일치하는지 확인

### 스타일이 적용되지 않음
- CSS 파일이 제대로 로드되는지 확인
- CSS 변수가 올바르게 설정되었는지 확인