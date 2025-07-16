# 🚀 외부 스킨 빠른 시작 가이드

5분 안에 첫 스킨 만들기!

## 1️⃣ 설치 및 시작 (2분)

```bash
# 템플릿 복사
cp -r external-skin-template my-skin
cd my-skin

# 패키지 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:3001 확인

## 2️⃣ 스킨 이름 변경 (1분)

### 3곳 수정:

1. **package.json**
```json
"name": "my-skin"
```

2. **webpack.config.js**
```javascript
output: {
  filename: 'my-skin.umd.js',
  library: 'MySkin',  // 띄어쓰기 없이!
}
```

3. **src/index.tsx** (맨 아래)
```typescript
window.MySkin = MyCustomSkin;
```

## 3️⃣ 빌드 (30초)

```bash
npm run build
```

결과물:
- `dist/my-skin.umd.js`
- `dist/my-skin.css`

## 4️⃣ 테스트 등록 (1분)

메인 프로젝트에서:

```javascript
// 로컬 테스트용
registerExternalLayout({
  id: 'my-skin',
  name: 'My Skin',
  umdUrl: 'http://localhost:3001/my-skin.umd.js',
  cssUrls: ['http://localhost:3001/my-skin.css'],
  globalName: 'MySkin'  // webpack의 library와 동일!
});
```

## 5️⃣ 배포 (30초)

### GitHub Pages 최단 경로:
1. GitHub에 저장소 생성
2. dist 폴더 내용을 gh-pages 브랜치에 푸시
3. Settings → Pages 활성화

### 또는 public 폴더 사용:
```bash
cp dist/* ../withcookie_webbuilder/public/skins/
```

## ⚡ 핵심 체크포인트

✅ **이름 3곳 동일?**
- webpack.config.js: `library: 'MySkin'`
- src/index.tsx: `window.MySkin`
- 등록할 때: `globalName: 'MySkin'`

✅ **개발 서버 실행 중?**
- `npm run dev` 상태 유지

✅ **빌드 파일 2개?**
- .umd.js 파일
- .css 파일

✅ **layout.children 있나?**
- 페이지 내용이 표시될 곳
- `{children}` ❌ → `{layout.children}` ✅

✅ **ExternalSkinProps 사용?**
- 독립적인 인터페이스 ❌
- ExternalSkinProps ✅

## 🔧 자주 쓰는 명령어

```bash
npm run dev    # 개발 서버 (http://localhost:3001)
npm run build  # 프로덕션 빌드
npm run clean  # dist 폴더 삭제
```

## 🔐 로그인 상태별 메뉴 구현

### 로그인 여부 판별 방법
스킨에서 사용할 수 있는 인증 관련 데이터:
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions }) => {
  const { 
    isUserLoggedIn,     // 일반 사용자 로그인 여부
    isAdminLoggedIn,    // 관리자 로그인 여부  
    user               // 사용자 정보 (id, name, email, avatar)
  } = data;
  
  const { onLogin, onLogout, onCheckAuth } = actions;
  
  // 전체 로그인 상태 확인
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
};
```

### 로그인 상태별 조건부 메뉴
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions, utils }) => {
  const { isUserLoggedIn, isAdminLoggedIn, user } = data;
  const { onLogout } = actions;
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  return (
    <nav className="main-navigation">
      <ul className="nav-primary">
        {/* 항상 표시되는 메뉴 */}
        <li><a href="/">홈</a></li>
        <li><a href="/products">상품</a></li>
        
        {/* 로그인 시에만 표시 */}
        {isLoggedIn && (
          <>
            <li><a href="/mypage">마이페이지</a></li>
            <li><a href="/orders">주문내역</a></li>
            <li><a href="/wishlist">위시리스트</a></li>
          </>
        )}
        
        {/* 비로그인 시에만 표시 */}
        {!isLoggedIn && (
          <>
            <li><a href="/login">로그인</a></li>
            <li><a href="/register">회원가입</a></li>
          </>
        )}
        
        {/* 관리자 전용 메뉴 */}
        {isAdminLoggedIn && (
          <li><a href="/admin">관리자 페이지</a></li>
        )}
      </ul>
      
      {/* 사용자 정보 영역 */}
      {isLoggedIn && (
        <div className="user-info">
          <img src={user?.avatar || '/default-avatar.png'} alt="프로필" />
          <span>{user?.name}</span>
          <button onClick={onLogout}>로그아웃</button>
        </div>
      )}
    </nav>
  );
};
```

### 메뉴 데이터 기반 자동 필터링
메뉴 객체의 `is_logged`, `is_not_logged` 속성 활용:
```typescript
const renderMenus = (menus: any[]) => {
  const filteredMenus = menus.filter(menu => {
    // 로그인 필요 메뉴 체크
    if (menu.is_logged && !isLoggedIn) return false;
    // 비로그인 전용 메뉴 체크  
    if (menu.is_not_logged && isLoggedIn) return false;
    return menu.visible;
  });
  
  return filteredMenus.map(menu => (
    <li key={menu.id}>
      <a href={menu.url}>{menu.name}</a>
    </li>
  ));
};
```

## 🏢 비즈니스 전용 메뉴 구현

### isBusiness + 로그인 조건부 메뉴 표시
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions, utils, layout, theme }) => {
  const { isBusiness, isUserLoggedIn, isAdminLoggedIn, user } = data;
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  return (
    <div>
      <nav className="main-navigation">
        <ul className="nav-primary">
          {/* 일반 메뉴 */}
          <li><a href="/">홈</a></li>
          <li><a href="/products">상품</a></li>
          
          {/* 비즈니스 + 로그인 조건부 메뉴 */}
          {isBusiness && isLoggedIn && (
            <>
              <li className="business-menu">
                <a href="/business/dashboard">비즈니스 대시보드</a>
                {/* 2차 메뉴 */}
                <ul className="nav-secondary">
                  <li><a href="/business/analytics">분석</a></li>
                  <li><a href="/business/reports">리포트</a></li>
                  <li><a href="/business/settings">설정</a></li>
                </ul>
              </li>
              <li className="business-menu">
                <a href="/business/management">관리</a>
                <ul className="nav-secondary">
                  <li><a href="/business/users">사용자 관리</a></li>
                  <li><a href="/business/roles">권한 관리</a></li>
                </ul>
              </li>
            </>
          )}
          
          {/* 비즈니스인데 로그인 안 한 경우 */}
          {isBusiness && !isLoggedIn && (
            <li>
              <a href="/business/login">비즈니스 로그인</a>
            </li>
          )}
        </ul>
      </nav>
      
      <main>{layout.children}</main>
    </div>
  );
};
```

### 2차 메뉴 스타일링
```scss
.business-menu {
  position: relative;
  
  &:hover .nav-secondary {
    display: block;
  }
}

.nav-secondary {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 200px;
  z-index: 1000;
  
  li {
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  a {
    display: block;
    padding: 12px 16px;
    color: #333;
    text-decoration: none;
    
    &:hover {
      background: #f5f5f5;
    }
  }
}
```

## 🏢 사이트 정보 및 브랜딩 구현

### 로고 이미지 사용법
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { withcookieData, isUserLoggedIn, user } = data;
  
  // 기본 로고 URL 가져오기
  const defaultLogoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  // 회사별 로그인 상태에 따른 로고 (고급)
  const companySettings = withcookieData?.skin?.company?.companySettingJson;
  let logoUrl = defaultLogoUrl;
  
  if (companySettings && typeof companySettings === 'object') {
    if (isUserLoggedIn && companySettings.logo_url_logged) {
      logoUrl = companySettings.logo_url_logged;
    } else if (!isUserLoggedIn && companySettings.logo_url_nonlogged) {
      logoUrl = companySettings.logo_url_nonlogged;
    }
  }
  
  const companyName = withcookieData?.skin?.extra?.company_name || '회사명';
  
  return (
    <header>
      <div className="logo">
        <img 
          src={logoUrl}
          alt={companyName}
          onError={(e) => {
            e.currentTarget.src = '/assets_flone/img/logo/logo.png';
          }}
        />
      </div>
    </header>
  );
};
```

### 푸터 정보 구성
```typescript
const Footer: React.FC<{ data: any }> = ({ data }) => {
  const { withcookieData } = data;
  
  // 회사 정보
  const companyInfo = {
    name: withcookieData?.skin?.extra?.company_name,
    address: withcookieData?.skin?.address,
    phone: withcookieData?.skin?.phone,
    email: withcookieData?.skin?.email,
    owner: withcookieData?.skin?.owner,
    businessNumber: withcookieData?.skin?.businessNumber,
    mailOrderCert: withcookieData?.skin?.mailOrderBusinessCertificate
  };
  
  // SNS 링크
  const snsLinks = withcookieData?.skin?.extra?.sns_banner || [
    { url: '#', text: 'Facebook', style: 'facebook' },
    { url: '#', text: 'Twitter', style: 'twitter' },
    { url: '#', text: 'Instagram', style: 'instagram' }
  ];
  
  // 로고
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  return (
    <footer className="footer-area">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            {/* 회사 정보 */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <img 
                  src={logoUrl} 
                  alt={companyInfo.name}
                  style={{ maxHeight: '70px', marginBottom: '20px' }}
                />
                <div className="company-info">
                  <p><strong>{companyInfo.name}</strong></p>
                  {companyInfo.address && <p>주소: {companyInfo.address}</p>}
                  {companyInfo.phone && <p>전화: {companyInfo.phone}</p>}
                  {companyInfo.email && <p>이메일: {companyInfo.email}</p>}
                  {companyInfo.owner && <p>대표: {companyInfo.owner}</p>}
                  {companyInfo.businessNumber && <p>사업자등록번호: {companyInfo.businessNumber}</p>}
                  {companyInfo.mailOrderCert && <p>통신판매업신고번호: {companyInfo.mailOrderCert}</p>}
                </div>
              </div>
            </div>
            
            {/* SNS 링크 */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h4>소셜 미디어</h4>
                <div className="social-links">
                  {snsLinks.map((sns, index) => (
                    <a 
                      key={index}
                      href={sns.url}
                      className={`social-link ${sns.style}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sns.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 저작권 */}
            <div className="col-lg-4 col-md-12">
              <div className="footer-widget">
                <p className="copyright">
                  © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

### 테마 색상 시스템
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { withcookieData } = data;
  
  // 테마 색상 가져오기
  const theme = withcookieData?.skin?.theme || {};
  const colorSet = theme?.colorset || {};
  
  const colors = {
    primary: colorSet?.primary || "#181B42",
    secondary: colorSet?.secondary || "#313AB9", 
    tertiary: colorSet?.tertiary || ""
  };
  
  // CSS 변수 동적 설정
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    if (colors.tertiary) {
      root.style.setProperty('--tertiary-color', colors.tertiary);
    }
  }, [colors]);
  
  return (
    <div style={{ '--theme-primary': colors.primary } as React.CSSProperties}>
      {/* 컴포넌트 내용 */}
    </div>
  );
};
```

### SEO 메타 정보 활용
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { withcookieData } = data;
  
  const seoData = {
    title: withcookieData?.skin?.headTitle,
    description: withcookieData?.skin?.headDescription,
    keywords: withcookieData?.skin?.headKeywords,
    ogImage: withcookieData?.skin?.headOgImage
  };
  
  useEffect(() => {
    // 동적 메타 태그 설정
    if (seoData.title) {
      document.title = seoData.title;
    }
    
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    if (seoData.description) setMetaTag('description', seoData.description);
    if (seoData.keywords) setMetaTag('keywords', seoData.keywords);
    if (seoData.ogImage) setMetaTag('og:image', seoData.ogImage);
  }, [seoData]);
};
```

### 쇼핑몰 기능 통합
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions }) => {
  const { cartItems, companyIsUse, withcookieData } = data;
  
  // 쇼핑몰 기능 사용 여부
  const useShop = withcookieData?.skin?.company?.useShop && companyIsUse;
  const cartCount = cartItems?.length || 0;
  
  return (
    <header>
      {/* 일반 메뉴 */}
      <nav>...</nav>
      
      {/* 쇼핑몰 기능이 활성화된 경우에만 표시 */}
      {useShop && (
        <div className="header-actions">
          <button className="cart-trigger">
            <i className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
```

### 다국어 지원
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, utils }) => {
  const { currentLanguage, translations } = data;
  
  // 번역 함수
  const t = (key: string) => {
    return translations?.[key] || key;
  };
  
  return (
    <nav>
      <a href="/">{t('home')}</a>
      <a href="/products">{t('products')}</a>
      <a href="/contact">{t('contact')}</a>
      
      {/* 언어 선택기 */}
      <div className="language-selector">
        <select 
          value={currentLanguage} 
          onChange={(e) => utils.changeLanguage(e.target.value)}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
  );
};
```

## 🎨 빠른 커스터마이징

### 색상 변경 (src/styles/main.scss)
```scss
:root {
  --primary-color: #ff6b6b;    // 빨간색
  --secondary-color: #4ecdc4;  // 청록색
}
```

### 헤더 높이 변경
```scss
.custom-skin-header {
  height: 80px;  // 원하는 높이
}
```

### 폰트 변경
```scss
:root {
  --font-family: 'Noto Sans KR', sans-serif;
}
```

## 🚨 문제 해결 1초 진단

| 증상 | 원인 | 해결 |
|------|------|------|
| 스킨이 안 보임 | URL 틀림 | Network 탭에서 404 확인 |
| "not defined" 에러 | globalName 불일치 | 3곳 이름 확인 |
| 스타일 안 먹힘 | CSS 미로드 | cssUrls 경로 확인 |
| CORS 에러 | 로컬 파일 직접 열기 | 서버 통해서 접근 |
| 페이지 내용 안 보임 | children 위치 틀림 | `{layout.children}` 확인 |
| "undefined" 에러 | props 구조 틀림 | ExternalSkinProps 사용 |

## 📋 완전한 데이터 활용 체크리스트

### ✅ 기본 구조
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ 
  data, 
  actions, 
  utils, 
  layout, 
  theme 
}) => {
  // 1. ✅ 필수 데이터 구조분해
  const {
    // 인증 관련
    isUserLoggedIn,
    isAdminLoggedIn, 
    user,
    
    // 사이트 데이터
    withcookieData,
    
    // 메뉴 데이터
    menus,
    globalMenus,
    mainMenus,
    
    // 쇼핑 데이터 
    cartItems,
    companyIsUse,
    
    // 다국어
    currentLanguage,
    translations,
    
    // 비즈니스
    isBusiness
  } = data;
  
  // 2. ✅ 로고 URL 처리
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  // 3. ✅ 테마 색상 설정
  const colors = {
    primary: withcookieData?.skin?.theme?.colorset?.primary || "#181B42",
    secondary: withcookieData?.skin?.theme?.colorset?.secondary || "#313AB9",
    tertiary: withcookieData?.skin?.theme?.colorset?.tertiary || ""
  };
  
  // 4. ✅ 회사 정보
  const companyInfo = {
    name: withcookieData?.skin?.extra?.company_name,
    address: withcookieData?.skin?.address,
    phone: withcookieData?.skin?.phone,
    email: withcookieData?.skin?.email,
    owner: withcookieData?.skin?.owner,
    businessNumber: withcookieData?.skin?.businessNumber,
    mailOrderCert: withcookieData?.skin?.mailOrderBusinessCertificate
  };
  
  // 5. ✅ 쇼핑몰 기능 체크
  const useShop = withcookieData?.skin?.company?.useShop && companyIsUse;
  
  // 6. ✅ 번역 함수
  const t = (key: string) => translations?.[key] || key;
  
  // 7. ✅ 로그인 상태 통합
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  return (
    <div>
      {layout.showHeader && (
        <Header 
          logoUrl={logoUrl}
          companyName={companyInfo.name}
          menus={menus}
          isLoggedIn={isLoggedIn}
          user={user}
          cartItems={cartItems}
          useShop={useShop}
          translations={t}
          onLogout={actions.onLogout}
        />
      )}
      
      {/* ✅ 컨텐츠 영역 */}
      <main>
        {layout.children}
      </main>
      
      {layout.showFooter && (
        <Footer 
          logoUrl={logoUrl}
          companyInfo={companyInfo}
          snsLinks={withcookieData?.skin?.extra?.sns_banner}
          translations={t}
        />
      )}
    </div>
  );
};

// ✅ UMD export
window.MySkin = MySkin;
```

### 🔍 데이터 활용 필수 항목

| 항목 | 데이터 경로 | 필수도 | 설명 |
|------|-------------|--------|------|
| **로고 이미지** | `withcookieData.skin.theme.main_logo_url` | ⭐⭐⭐ | 기본 로고, 에러 핸들링 필수 |
| **회사명** | `withcookieData.skin.extra.company_name` | ⭐⭐⭐ | 브랜딩의 핵심 |
| **테마 색상** | `withcookieData.skin.theme.colorset` | ⭐⭐⭐ | primary, secondary, tertiary |
| **로그인 상태** | `isUserLoggedIn`, `isAdminLoggedIn` | ⭐⭐⭐ | 메뉴 조건부 표시 |
| **사용자 정보** | `user` (id, name, email, avatar) | ⭐⭐ | 로그인 시 표시 |
| **메뉴 데이터** | `menus`, `mainMenus`, `globalMenus` | ⭐⭐⭐ | 네비게이션 구성 |
| **회사 정보** | `withcookieData.skin.address/phone/email` | ⭐⭐ | 푸터 정보 |
| **쇼핑카트** | `cartItems`, `companyIsUse` | ⭐⭐ | 쇼핑몰 기능 |
| **다국어** | `currentLanguage`, `translations` | ⭐ | 국제화 지원 |
| **SNS 링크** | `withcookieData.skin.extra.sns_banner` | ⭐ | 소셜 미디어 |
| **SEO 정보** | `withcookieData.skin.headTitle/Description` | ⭐ | 검색엔진 최적화 |
| **비즈니스 여부** | `isBusiness` | ⭐ | B2B 기능 |

### 🚨 놓치기 쉬운 중요 사항

1. **로고 에러 핸들링**
   ```typescript
   <img 
     src={logoUrl}
     onError={(e) => {
       e.currentTarget.src = '/assets_flone/img/logo/logo.png';
     }}
   />
   ```

2. **메뉴 필터링 로직**
   ```typescript
   const visibleMenus = menus.filter(menu => {
     if (menu.is_logged && !isLoggedIn) return false;
     if (menu.is_not_logged && isLoggedIn) return false;
     return menu.visible;
   });
   ```

3. **CSS 변수 동적 설정**
   ```typescript
   useEffect(() => {
     document.documentElement.style.setProperty('--primary-color', colors.primary);
   }, [colors]);
   ```

4. **회사별 로고 분기 처리**
   ```typescript
   const companySettings = withcookieData?.skin?.company?.companySettingJson;
   if (companySettings?.logo_url_logged && isLoggedIn) {
     logoUrl = companySettings.logo_url_logged;
   }
   ```

### 📱 반응형 고려사항

- **로고 크기**: 모바일 70px, 데스크톱 90px
- **메뉴 토글**: 모바일에서 햄버거 메뉴 필요
- **카트 표시**: 모바일에서 간소화된 아이콘
- **푸터 레이아웃**: 모바일에서 세로 정렬

---

💡 **프로 팁**: 개발할 때는 `npm run dev` 상태로 두고, 메인 프로젝트에서 `http://localhost:3001` URL로 테스트하면 실시간 반영됩니다!