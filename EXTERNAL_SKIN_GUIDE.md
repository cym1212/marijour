# 🎨 Withcookie 외부 스킨 제작 가이드

이 가이드는 React를 처음 접하는 개발자도 쉽게 외부 스킨을 만들고 등록할 수 있도록 작성되었습니다.

## 📋 목차
1. [준비물](#준비물)
2. [스킨이란?](#스킨이란)
3. [Step 1: 개발 환경 설정](#step-1-개발-환경-설정)
4. [Step 2: 스킨 프로젝트 생성](#step-2-스킨-프로젝트-생성)
5. [Step 3: 스킨 개발하기](#step-3-스킨-개발하기)
6. [Step 4: 스킨 빌드하기](#step-4-스킨-빌드하기)
7. [Step 5: 스킨 배포하기](#step-5-스킨-배포하기)
8. [Step 6: 스킨 등록하기](#step-6-스킨-등록하기)
9. [문제 해결](#문제-해결)
10. [참고 자료](#참고-자료)

---

## 준비물

### 필수 프로그램 설치
1. **Node.js** (버전 14 이상)
   - 다운로드: https://nodejs.org/
   - LTS 버전 권장
   - 설치 확인: 터미널에서 `node --version`

2. **코드 에디터**
   - Visual Studio Code 추천: https://code.visualstudio.com/
   - 다른 에디터도 가능 (Sublime Text, Atom 등)

3. **Git** (선택사항)
   - 버전 관리용
   - 다운로드: https://git-scm.com/

---

## 스킨이란?

스킨은 웹사이트의 **겉모습(디자인)**을 담당하는 템플릿입니다.
- 헤더 (상단 메뉴)
- 푸터 (하단 정보)
- 사이드바 (선택사항)
- 전체적인 색상과 스타일

**UMD**는 Universal Module Definition의 약자로, 어디서든 사용할 수 있는 JavaScript 모듈 형식입니다.

---

## Step 1: 개발 환경 설정

### 1.1 터미널 열기
- **Windows**: 시작 메뉴 → "cmd" 또는 "PowerShell" 검색
- **Mac**: Spotlight(⌘+Space) → "Terminal" 검색

### 1.2 작업 폴더 만들기
```bash
# 바탕화면에 작업 폴더 만들기
cd Desktop
mkdir my-skins
cd my-skins
```

### 1.3 템플릿 다운로드
```bash
# Git이 있는 경우
git clone https://github.com/your-repo/external-skin-template.git my-first-skin

# Git이 없는 경우: 수동으로 다운로드
# 1. external-skin-template 폴더를 ZIP으로 다운로드
# 2. my-skins 폴더에 압축 해제
# 3. 폴더명을 'my-first-skin'으로 변경
```

---

## Step 2: 스킨 프로젝트 생성

### 2.1 프로젝트 폴더로 이동
```bash
cd my-first-skin
```

### 2.2 필요한 패키지 설치
```bash
npm install
```
⏱️ 약 2-5분 소요됩니다. 커피 한 잔 하고 오세요!

### 2.3 개발 서버 실행
```bash
npm run dev
```
✅ 브라우저가 자동으로 열리고 http://localhost:3001 에서 스킨을 볼 수 있습니다.

---

## Step 3: 스킨 개발하기

### 3.1 기본 구조 이해하기

```
my-first-skin/
├── src/
│   ├── index.tsx          # 🎯 메인 스킨 파일 (가장 중요!)
│   ├── components/        # 📦 부품들 (헤더, 푸터 등)
│   │   ├── Header.tsx     # 상단 메뉴
│   │   ├── Footer.tsx     # 하단 정보
│   │   └── Sidebar.tsx    # 옆 메뉴
│   └── styles/
│       └── main.scss      # 🎨 디자인 파일
└── package.json           # 📋 프로젝트 설정
```

### ⚠️ 3.2 중요: Props 인터페이스 이해하기

외부 스킨은 메인 프로젝트와 **정해진 규칙(인터페이스)**으로 소통합니다.

#### ❌ 잘못된 방법 (독립적인 인터페이스)
```typescript
// 이렇게 하면 안 됩니다!
interface MyCustomProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const MySkin = ({ children, showSidebar }) => { ... }
```

#### ✅ 올바른 방법 (ExternalSkinProps 사용)
```typescript
import { ExternalSkinProps } from './types/skin-props';

const MySkin: React.FC<ExternalSkinProps> = ({
  data,      // 사용자, 메뉴, 회사 정보 등
  actions,   // 로그인, 로그아웃 등의 함수
  utils,     // 네비게이션, 번역 등의 유틸리티
  layout,    // ⭐ children이 여기 안에 있습니다!
  theme      // 색상 설정
}) => {
  // layout 객체에서 필요한 것들 꺼내기
  const { children, showSidebar, showHeader, showFooter } = layout;
  
  return (
    <div>
      {showHeader && <Header />}
      {children}  {/* ❌ 아님 */}
      {layout.children}  {/* ✅ 맞음 */}
      {showFooter && <Footer />}
    </div>
  );
};
```

💡 **핵심**: 템플릿에 이미 올바른 구조가 있으니 수정하지 마세요!

### 3.3 스킨 이름 변경하기

#### 1) package.json 수정
```json
{
  "name": "my-awesome-skin",  // ← 여기를 원하는 이름으로
  "version": "1.0.0",
  ...
}
```

#### 2) webpack.config.js 수정
```javascript
output: {
  filename: 'my-awesome-skin.umd.js',  // ← 파일명 변경
  library: 'MyAwesomeSkin',            // ← 전역 변수명 (띄어쓰기 없이!)
  ...
}
```

#### 3) src/index.tsx 수정
```typescript
// 맨 아래쪽에서 찾기
if (typeof window !== 'undefined') {
  window.MyAwesomeSkin = MyCustomSkin;  // ← 위와 동일하게
}
```

### 3.4 색상 변경하기

`src/styles/main.scss` 파일을 열어서:

```scss
:root {
  // 주요 색상들
  --primary-color: #007bff;    // 메인 색상 (파란색)
  --secondary-color: #6c757d;  // 보조 색상 (회색)
  --danger-color: #dc3545;     // 경고 색상 (빨간색)
  --success-color: #28a745;    // 성공 색상 (초록색)
  
  // 원하는 색상으로 변경하세요!
  // 예: --primary-color: #ff6b6b;  // 분홍색
}
```

💡 **색상 선택 도구**: https://colorhunt.co/

### 3.5 로고 변경하기

`src/components/Header.tsx` 파일에서:

```typescript
<img src="/logo.png" alt="Logo" className="header-logo" />
// ↓ 변경
<img src="https://내사이트.com/my-logo.png" alt="My Logo" className="header-logo" />
```

### 3.6 메뉴 스타일 변경하기

`src/styles/main.scss`에서 헤더 스타일 수정:

```scss
.custom-skin-header {
  background: white;           // 배경색
  height: 80px;               // 높이
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  // 그림자
}
```

### 📍 3.7 컨텐츠 영역 지정하기 (필수!)

스킨에서 **가장 중요한 부분**은 페이지 컨텐츠가 들어갈 위치를 지정하는 것입니다.

`src/index.tsx` 파일에서:

```typescript
return (
  <div className="custom-skin-container">
    <Header />
    
    <main className="custom-skin-content">
      {layout.children}  {/* 🎯 여기에 페이지 내용이 들어갑니다! */}
    </main>
    
    <Footer />
  </div>
);
```

⚠️ **절대 주의사항**:
- ❌ `{children}` - 직접 props에서 받지 마세요
- ✅ `{layout.children}` - layout 객체에서 가져오세요

만약 `{layout.children}`을 빠뜨리면:
- 페이지 내용이 표시되지 않습니다
- 빈 스킨만 보입니다

#### 시각적 구조:
```
┌─────────────────────────────────┐
│         Header                  │
├─────────┬───────────────────────┤
│ Sidebar │ {layout.children}     │ ← 페이지 내용이 여기 표시됨!
│(선택)   │                       │
│         │                       │
└─────────┴───────────────────────┘
│         Footer                  │
└─────────────────────────────────┘
```

---

## Step 4: 스킨 빌드하기

### 4.1 개발 서버 중지
터미널에서 `Ctrl + C` (Mac은 `Cmd + C`)

### 4.2 프로덕션 빌드 실행
```bash
npm run build
```

### 4.3 빌드 결과 확인
```
dist/
├── my-awesome-skin.umd.js    # ✅ JavaScript 파일
└── my-awesome-skin.css       # ✅ CSS 파일
```

🎉 축하합니다! 스킨이 빌드되었습니다!

---

## Step 5: 스킨 배포하기

### 방법 1: GitHub Pages 사용 (무료, 추천!)

#### 1) GitHub 계정 만들기
https://github.com 에서 무료 가입

#### 2) 새 저장소(Repository) 만들기
- Repository name: `my-awesome-skin`
- Public 선택
- Create repository 클릭

#### 3) 파일 업로드
```bash
# Git 초기화
git init
git add .
git commit -m "My first skin"

# GitHub에 연결 (your-username을 본인 것으로 변경)
git remote add origin https://github.com/your-username/my-awesome-skin.git
git push -u origin main
```

#### 4) GitHub Pages 활성화
1. GitHub 저장소 → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, 폴더: /root
4. Save

#### 5) 배포 URL 확인
약 5분 후:
- JS: `https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.umd.js`
- CSS: `https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.css`

### 방법 2: Netlify 사용 (더 쉬움!)

#### 1) Netlify 가입
https://www.netlify.com 에서 GitHub으로 가입

#### 2) dist 폴더 드래그 앤 드롭
1. Netlify 대시보드에서 dist 폴더를 드래그
2. 자동으로 URL 생성됨

#### 3) URL 확인
- JS: `https://amazing-site-name.netlify.app/my-awesome-skin.umd.js`
- CSS: `https://amazing-site-name.netlify.app/my-awesome-skin.css`

### 방법 3: 로컬 테스트 (개발용)

메인 프로젝트의 `public` 폴더에 복사:
```bash
cp dist/my-awesome-skin.umd.js ../withcookie_webbuilder/public/
cp dist/my-awesome-skin.css ../withcookie_webbuilder/public/
```

---

## Step 6: 스킨 등록하기

### 6.1 메인 프로젝트에서 스킨 등록

`withcookie_webbuilder` 프로젝트의 아무 초기화 파일에 추가:

```javascript
import { registerExternalLayout } from './layouts/ExternalLayoutLoader';

// 스킨 등록
registerExternalLayout({
  id: 'my-awesome-skin',           // 고유 ID
  name: '나의 멋진 스킨',            // 표시될 이름
  description: '깔끔하고 모던한 디자인',  // 설명
  version: '1.0.0',                // 버전
  author: '홍길동',                 // 제작자
  
  // 🔴 중요: 실제 배포된 URL로 변경하세요!
  umdUrl: 'https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.umd.js',
  cssUrls: ['https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.css'],
  
  // 🔴 중요: webpack.config.js의 library와 동일해야 함!
  globalName: 'MyAwesomeSkin'
});
```

### 6.2 개발 중 테스트

개발 서버가 실행 중일 때:

```javascript
// 개발용 등록 (localhost)
if (process.env.NODE_ENV === 'development') {
  registerExternalLayout({
    id: 'dev-skin',
    name: '개발 중인 스킨',
    umdUrl: 'http://localhost:3001/my-awesome-skin.umd.js',
    cssUrls: ['http://localhost:3001/my-awesome-skin.css'],
    globalName: 'MyAwesomeSkin'
  });
}
```

### 6.3 스킨 사용하기

1. 웹빌더 실행
2. 레이아웃 선택 드롭다운 클릭
3. "나의 멋진 스킨" 선택
4. ✨ 완료!

---

## 문제 해결

### ❌ "Module not found" 에러
```bash
npm install  # 패키지 재설치
```

### ❌ 스킨이 로드되지 않음
1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 에러 확인
3. Network 탭에서 파일이 제대로 로드되는지 확인

### ❌ CORS 에러
로컬 파일을 직접 열면 발생. 해결방법:
- 개발 서버 사용 (`npm run dev`)
- 실제 웹서버에 배포

### ❌ "MyAwesomeSkin is not defined" 에러
`globalName`이 일치하는지 확인:
- webpack.config.js의 `library`
- src/index.tsx의 `window.MyAwesomeSkin`
- 등록할 때의 `globalName`

세 곳 모두 동일해야 합니다!

### ❌ 페이지 내용이 표시되지 않음
1. `{layout.children}`이 있는지 확인
2. `{children}`이 아닌 `{layout.children}` 사용하는지 확인
3. main 태그나 content 영역 안에 있는지 확인

### ❌ "Cannot read property 'children' of undefined"
props 구조가 잘못됨. ExternalSkinProps 인터페이스 사용 확인:
```typescript
// ❌ 잘못됨
const MySkin = ({ children }) => ...

// ✅ 올바름
const MySkin: React.FC<ExternalSkinProps> = ({ layout }) => ...
```

---

## 🎯 체크리스트

- [ ] Node.js 설치됨
- [ ] 템플릿 다운로드함
- [ ] `npm install` 실행함
- [ ] `npm run dev`로 개발 서버 확인함
- [ ] 스킨 이름 3곳 모두 변경함
- [ ] 색상 변경함
- [ ] `npm run build` 실행함
- [ ] dist 폴더에 파일 2개 생성됨
- [ ] 파일을 웹에 업로드함
- [ ] URL을 복사함
- [ ] 메인 프로젝트에 등록함
- [ ] 레이아웃 선택기에서 확인함
- [ ] `{layout.children}` 추가함 (페이지 내용 표시 위치)
- [ ] ExternalSkinProps 인터페이스 사용함

---

## 다음 단계

1. **반응형 디자인 추가**
   ```scss
   @media (max-width: 768px) {
     // 모바일 스타일
   }
   ```

2. **애니메이션 추가**
   ```scss
   .header {
     transition: all 0.3s ease;
   }
   ```

3. **다크 모드 지원**
   ```scss
   [data-theme="dark"] {
     --primary-color: #ffffff;
     --background-color: #1a1a1a;
   }
   ```

---

## 도움말

### 유용한 링크
- React 기초: https://react.dev/learn
- CSS 색상: https://htmlcolorcodes.com/
- 무료 아이콘: https://fontawesome.com/

### 커뮤니티
- 질문하기: [GitHub Issues](https://github.com/your-repo/issues)
- 예제 스킨: [Examples](https://github.com/your-repo/examples)

---

🎉 **축하합니다!** 이제 여러분도 스킨 개발자입니다!

문제가 있거나 도움이 필요하면 언제든지 문의하세요.




⏺ 외부 스킨에 전달되는 데이터는 크게 4개 카테고리로 구성되어 있습니다:

  1. Data Props - 데이터

  - user: 사용자 정보 (id, name, email, avatar 등)
  - company: 회사 정보 (id, name, logo, settings 등)
  - withcookieData: 전체 시스템 데이터
  - menus: 전체 메뉴 목록
  - globalMenus: 글로벌 메뉴 목록
  - mainMenus: 메인 메뉴 목록
  - assetBalances: 자산 잔액 정보
  - transactions: 거래 내역
  - cartItems: 장바구니 아이템
  - isUserLoggedIn: 사용자 로그인 상태
  - isAdminLoggedIn: 관리자 로그인 상태
  - currentLanguage: 현재 언어 (KR, EN 등)
  - translations: 번역 사전

  2. Actions - 액션 함수들

  - onLogin: 로그인 처리
  - onLogout: 로그아웃 처리
  - onCheckAuth: 인증 상태 확인
  - onFetchBalances: 잔액 정보 가져오기
  - onFetchTransactions: 거래 내역 가져오기
  - onFetchCartItems: 장바구니 아이템 가져오기
  - onFetchMenus: 메뉴 정보 가져오기
  - onFetchWithcookieData: 전체 데이터 가져오기
  - onUpdateCart: 장바구니 업데이트
  - onChangeLanguage: 언어 변경

  3. Utils - 유틸리티

  - navigate: 페이지 이동 함수
  - location: 현재 위치 정보 (pathname, search, hash, state)
  - params: URL 파라미터
  - t: 번역 함수
  - formatCurrency: 통화 포맷 함수
  - formatDate: 날짜 포맷 함수

  4. Layout & Theme - 레이아웃과 테마

  - layout.children: 페이지 컨텐츠
  - layout.currentMenuId: 현재 메뉴 ID
  - layout.breadcrumbs: 브레드크럼 정보
  - layout.pageTitle: 페이지 제목
  - layout.showHeader/Footer/Sidebar: 헤더/푸터/사이드바 표시 여부
  - theme: 색상, 폰트, 간격, 브레이크포인트 등 테마 설정

  외부 스킨은 이 모든 데이터와 함수들을 props로 받아서 사용할 수 있습니다.