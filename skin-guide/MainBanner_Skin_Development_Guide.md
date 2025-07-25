# 메인배너 스킨 개발 가이드

이 가이드는 웹빌더의 메인배너(MainBanner) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 데이터 구조

### 배너 아이템 (BannerItem)

```typescript
interface BannerItem {
  // 미디어 관련
  icon?: string;                     // 배너 이미지 URL
  mediaType?: 'image' | 'video';     // 미디어 타입
  videoUrl?: string;                 // 비디오 URL
  autoplay?: boolean;                // 비디오 자동 재생 여부
  muted?: boolean;                   // 비디오 음소거 여부
  loop?: boolean;                    // 비디오 반복 여부
  
  // 텍스트 관련
  text?: string;                     // 배너 제목
  description?: string;              // 배너 설명
  textColor?: string;                // 텍스트 색상
  textShadow?: string;               // 텍스트 그림자
  showTitle?: boolean;               // 제목 표시 여부
  
  // 버튼 관련
  buttonText?: string;               // 버튼 텍스트
  buttonBgColor?: string;            // 버튼 배경색
  buttonTextColor?: string;          // 버튼 텍스트 색상
  buttonHoverColor?: string;         // 버튼 호버 색상
  showButton?: boolean;              // 버튼 표시 여부
  transparentButton?: boolean;       // 투명 버튼 여부
  buttonWidth?: string;              // 버튼 너비
  buttonHeight?: string;             // 버튼 높이
  mobileButtonWidth?: string;        // 모바일 버튼 너비
  mobileButtonHeight?: string;       // 모바일 버튼 높이
  mobileFullWidth?: boolean;         // 모바일에서 전체 너비 사용 여부
  
  // 링크 관련
  url?: string;                      // 배너 링크 URL
  
  // 레이아웃 관련
  position?: string;                 // 배너 위치 (1~9, 3x3 그리드 기준)
  hasBackground?: boolean;           // 배경 사용 여부
  style?: string | React.CSSProperties; // 추가 스타일
  
  // 기타
  [key: string]: any;                // 확장 가능한 속성
}
```

## SkinProps 인터페이스

실제 스킨이 받는 props는 다음과 같은 구조입니다:

```typescript
interface SkinProps {
  // ComponentSkinWrapper에서 병합된 데이터
  data: {
    // 원본 컴포넌트 데이터
    id: string;
    type: string;
    props: Record<string, any>;
    componentProps?: Record<string, any>;
    style?: React.CSSProperties;
    
    // MainBannerLogic에서 반환된 data 객체의 모든 필드가 직접 포함됨
    currentIndex: number;             // 현재 슬라이드 인덱스
    isTransitioning: boolean;         // 전환 중 상태
    isPaused: boolean;               // 일시정지 상태
    banners: BannerItem[];           // 배너 아이템 배열
    bannerMode: string;              // 배너 모드 ('slider', 'carousel', 'fade')
    autoPlay: boolean;               // 자동 재생 여부
    autoPlaySpeed: number;           // 자동 재생 속도 (ms)
    transitionSpeed: number;         // 전환 속도 (ms)
    showDots: boolean;               // 점 표시 여부
    showArrows: boolean;             // 화살표 표시 여부
    pauseOnHover: boolean;           // 호버 시 일시정지 여부
    infiniteLoop: boolean;           // 무한 루프 여부
    containerHeight: string;         // 컨테이너 높이 (반응형)
    isEditorMode: boolean;           // 에디터 모드 여부
    isPreviewMode: boolean;          // 프리뷰 모드 여부
    
    // 기타 데이터
    [key: string]: any;
  };
  
  // MainBannerLogic에서 반환된 액션들
  actions: {
    goToNext: () => void;                                    // 다음 슬라이드로 이동
    goToPrev: () => void;                                    // 이전 슬라이드로 이동
    goToSlide: (index: number) => void;                      // 특정 슬라이드로 이동
    onMouseEnter: () => void;                                // 마우스 엔터 핸들러
    onMouseLeave: () => void;                                // 마우스 리브 핸들러
    onTouchStart: (e: React.TouchEvent) => void;             // 터치 시작 핸들러
    onTouchMove: (e: React.TouchEvent) => void;              // 터치 이동 핸들러
    onTouchEnd: () => void;                                  // 터치 종료 핸들러
    onBannerClick: (banner: BannerItem) => void;             // 배너 클릭 핸들러
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    mode?: string;                       // 배너 모드 ('slider', 'carousel', 'fade')
    autoPlay?: boolean;                  // 자동 재생
    autoPlaySpeed?: number;              // 자동 재생 속도 (ms)
    transitionSpeed?: number;            // 전환 속도 (ms)
    showDots?: boolean;                  // 점 표시
    showArrows?: boolean;                // 화살표 표시
    pauseOnHover?: boolean;              // 호버 시 일시정지
    infiniteLoop?: boolean;              // 무한 루프
    desktopHeight?: string;              // 데스크톱 높이
    mobileHeight?: string;               // 모바일 높이
    style?: React.CSSProperties;         // 추가 스타일
    [key: string]: any;
  };
  
  // 렌더링 모드
  mode: 'editor' | 'preview' | 'production';
  
  // 유틸리티 함수들
  utils: {
    t: (key: string, params?: Record<string, any>) => string;  // 번역
    navigate: (path: string) => void;                          // 라우팅
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: string | Date, format?: string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: (string | undefined | null | false)[]) => string;
  };
  
  // 앱 전역 정보
  app?: {
    user?: any;                   // 사용자 정보
    company?: any;                // 회사 정보
    currentLanguage?: string;     // 현재 언어
    theme?: any;                  // 테마 정보
    isUserLoggedIn?: boolean;     // 로그인 여부
  };
  
  // 에디터 관련 정보 (에디터 모드에서만)
  editor?: {
    isSelected: boolean;         // 선택 상태
    onSelect: () => void;        // 선택 핸들러
    onEdit: () => void;          // 편집 핸들러
    onDelete: () => void;        // 삭제 핸들러
    dragHandleProps?: any;       // 드래그 핸들 props
  };
}
```

## 데이터 소스

메인배너 컴포넌트는 다음과 같은 방식으로 데이터를 받습니다:

1. **Property Panel**: 에디터에서 설정한 배너 옵션값 (options 객체로 전달)
2. **Banner Items**: 배너 아이템 배열 (data.banners로 전달)
3. **State Management**: 슬라이더 상태 (data 객체에 병합)
4. **Configuration**: 자동재생, 전환속도 등 설정값 (data 객체에 병합)

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MyMainBannerSkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app 
}) => {
  const { t, cx } = utils;
  
  // 데이터 추출
  const { 
    currentIndex,
    isTransitioning,
    isPaused,
    banners,
    bannerMode,
    autoPlay,
    showDots,
    showArrows,
    containerHeight,
    isEditorMode
  } = data;
  
  // 액션 사용
  const {
    goToNext,
    goToPrev,
    goToSlide,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onBannerClick
  } = actions;
  
  // 현재 배너
  const currentBanner = banners[currentIndex];
  
  return (
    <div 
      className={cx('main-banner-wrapper', options.className)}
      style={{ 
        height: containerHeight,
        position: 'relative',
        overflow: 'hidden',
        ...options.style 
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 배너 슬라이드 컨테이너 */}
      <div 
        className="banner-container"
        style={{
          display: 'flex',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? `transform ${data.transitionSpeed}ms ease` : 'none',
          width: `${banners.length * 100}%`,
          height: '100%'
        }}
      >
        {banners.map((banner, index) => (
          <div 
            key={index}
            className="banner-slide"
            style={{
              width: `${100 / banners.length}%`,
              height: '100%',
              position: 'relative',
              cursor: banner.url && banner.url !== '#' ? 'pointer' : 'default'
            }}
            onClick={() => onBannerClick(banner)}
          >
            {/* 배경 미디어 */}
            {banner.mediaType === 'video' ? (
              <video
                src={banner.videoUrl || banner.icon}
                autoPlay={banner.autoplay && !isEditorMode}
                muted={banner.muted}
                loop={banner.loop}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <img
                src={banner.icon}
                alt={banner.text || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
            
            {/* 텍스트 오버레이 */}
            <div 
              className={`banner-content position-${banner.position || '5'}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: banner.textColor || 'white',
                textShadow: banner.textShadow || '0 1px 2px rgba(0, 0, 0, 0.6)'
              }}
            >
              {banner.showTitle && banner.text && (
                <h2 className="banner-title">
                  {banner.text}
                </h2>
              )}
              
              {banner.description && (
                <p className="banner-description">
                  {banner.description}
                </p>
              )}
              
              {banner.showButton && banner.buttonText && (
                <button
                  className="banner-button"
                  style={{
                    backgroundColor: banner.transparentButton 
                      ? 'transparent' 
                      : (banner.buttonBgColor || '#ff6b6b'),
                    color: banner.buttonTextColor || 'white',
                    border: banner.transparentButton 
                      ? `2px solid ${banner.buttonTextColor || 'white'}` 
                      : 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: banner.mobileFullWidth && window.innerWidth <= 768 
                      ? '100%' 
                      : (window.innerWidth <= 768 
                          ? banner.mobileButtonWidth 
                          : banner.buttonWidth) || 'auto',
                    height: window.innerWidth <= 768 
                      ? banner.mobileButtonHeight 
                      : banner.buttonHeight || 'auto'
                  }}
                  onMouseOver={(e) => {
                    if (banner.buttonHoverColor) {
                      e.currentTarget.style.backgroundColor = banner.buttonHoverColor;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!banner.transparentButton) {
                      e.currentTarget.style.backgroundColor = banner.buttonBgColor || '#ff6b6b';
                    }
                  }}
                >
                  {banner.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 화살표 네비게이션 */}
      {showArrows && banners.length > 1 && (
        <>
          <button
            className="banner-arrow banner-arrow-prev"
            onClick={goToPrev}
            disabled={isTransitioning}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: isTransitioning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              opacity: isTransitioning ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            ‹
          </button>
          
          <button
            className="banner-arrow banner-arrow-next"
            onClick={goToNext}
            disabled={isTransitioning}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: isTransitioning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              opacity: isTransitioning ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            ›
          </button>
        </>
      )}
      
      {/* 점 네비게이션 */}
      {showDots && banners.length > 1 && (
        <div 
          className="banner-dots"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px'
          }}
        >
          {banners.map((_, index) => (
            <button
              key={index}
              className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.5)',
                cursor: isTransitioning ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isTransitioning ? 0.5 : 1
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMainBannerSkin;
```

## 배너 위치 시스템

배너 텍스트의 위치는 `position` 속성으로 제어할 수 있습니다 (1~9, 3x3 그리드 기준):

```typescript
// 위치 매핑 함수
const getPositionStyle = (position: string) => {
  const positionMap = {
    '1': { top: '20%', left: '20%', transform: 'translate(-50%, -50%)' },
    '2': { top: '20%', left: '50%', transform: 'translate(-50%, -50%)' },
    '3': { top: '20%', right: '20%', transform: 'translate(50%, -50%)' },
    '4': { top: '50%', left: '20%', transform: 'translate(-50%, -50%)' },
    '5': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    '6': { top: '50%', right: '20%', transform: 'translate(50%, -50%)' },
    '7': { bottom: '20%', left: '20%', transform: 'translate(-50%, 50%)' },
    '8': { bottom: '20%', left: '50%', transform: 'translate(-50%, 50%)' },
    '9': { bottom: '20%', right: '20%', transform: 'translate(50%, 50%)' }
  };
  
  return positionMap[position] || positionMap['5'];
};

// 사용 예제
<div 
  className="banner-content"
  style={{
    position: 'absolute',
    ...getPositionStyle(banner.position || '5'),
    textAlign: 'center'
  }}
>
  {/* 콘텐츠 */}
</div>
```

## 반응형 처리

### 모바일 대응

```typescript
// 반응형 유틸리티
const isMobile = () => window.innerWidth <= 768;
const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;

// 반응형 스타일
const getResponsiveStyle = (banner: BannerItem) => {
  if (isMobile()) {
    return {
      buttonWidth: banner.mobileFullWidth ? '100%' : banner.mobileButtonWidth,
      buttonHeight: banner.mobileButtonHeight,
      fontSize: '14px',
      padding: '10px 20px'
    };
  }
  
  return {
    buttonWidth: banner.buttonWidth,
    buttonHeight: banner.buttonHeight,
    fontSize: '16px',
    padding: '12px 24px'
  };
};
```

### CSS 미디어 쿼리

```css
/* 모바일 */
@media (max-width: 768px) {
  .main-banner-wrapper {
    height: 400px !important;
  }
  
  .banner-title {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .banner-description {
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  .banner-arrow {
    width: 32px !important;
    height: 32px !important;
    font-size: 14px !important;
  }
  
  .banner-dots {
    bottom: 10px !important;
  }
  
  .banner-dot {
    width: 8px !important;
    height: 8px !important;
  }
}

/* 태블릿 */
@media (max-width: 1024px) {
  .banner-title {
    font-size: 32px;
  }
  
  .banner-description {
    font-size: 16px;
  }
}
```

## 터치/스와이프 이벤트 처리

메인배너는 터치 이벤트를 자동으로 처리하므로, 스킨에서는 이벤트 핸들러만 연결하면 됩니다:

```typescript
<div 
  className="main-banner-wrapper"
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
  {/* 배너 콘텐츠 */}
</div>
```

터치 이벤트는 다음과 같이 동작합니다:
- **스와이프 감도**: 50px 이상 이동 시 슬라이드 변경
- **왼쪽 스와이프**: 다음 슬라이드로 이동
- **오른쪽 스와이프**: 이전 슬라이드로 이동

## 비디오 배경 처리

```typescript
const VideoBackground: React.FC<{ banner: BannerItem }> = ({ banner }) => {
  return (
    <video
      src={banner.videoUrl || banner.icon}
      autoPlay={banner.autoplay && !isEditorMode}
      muted={banner.muted !== false}  // 기본값 true
      loop={banner.loop !== false}    // 기본값 true
      playsInline
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1
      }}
      onError={(e) => {
        console.error('비디오 로드 실패:', e);
        // 폴백: 이미지로 전환
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};
```

## 모드별 구현

### 슬라이더 모드 (기본)

```typescript
// 기본 슬라이더 (좌우 슬라이드)
const SliderMode = () => (
  <div 
    style={{
      display: 'flex',
      transform: `translateX(-${currentIndex * 100}%)`,
      transition: isTransitioning ? `transform ${data.transitionSpeed}ms ease` : 'none',
      width: `${banners.length * 100}%`
    }}
  >
    {/* 배너 아이템들 */}
  </div>
);
```

### 캐러셀 모드

```typescript
// 다중 아이템 표시
const CarouselMode = () => {
  const visibleItems = 3; // 한 번에 보여줄 아이템 수
  
  return (
    <div 
      style={{
        display: 'flex',
        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
        transition: isTransitioning ? `transform ${data.transitionSpeed}ms ease` : 'none',
        width: `${(banners.length / visibleItems) * 100}%`
      }}
    >
      {banners.map((banner, index) => (
        <div 
          key={index}
          style={{ 
            width: `${100 / banners.length}%`,
            padding: '0 10px'
          }}
        >
          {/* 배너 콘텐츠 */}
        </div>
      ))}
    </div>
  );
};
```

### 페이드 모드

```typescript
// 페이드 인/아웃 효과
const FadeMode = () => (
  <div style={{ position: 'relative', height: '100%' }}>
    {banners.map((banner, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: index === currentIndex ? 1 : 0,
          transition: isTransitioning ? `opacity ${data.transitionSpeed}ms ease` : 'none'
        }}
      >
        {/* 배너 콘텐츠 */}
      </div>
    ))}
  </div>
);
```

## 성능 최적화

### 이미지 지연 로딩

```typescript
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} style={{ width: '100%', height: '100%' }}>
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </div>
  );
};
```

### 메모이제이션

```typescript
import { memo } from 'react';

const BannerSlide = memo<{ banner: BannerItem; index: number }>(({ banner, index }) => {
  return (
    <div className="banner-slide">
      {/* 배너 콘텐츠 */}
    </div>
  );
});

export default memo(MyMainBannerSkin);
```

## 접근성 고려사항

```typescript
// ARIA 속성 추가
<div 
  role="region"
  aria-label={t('메인 배너 슬라이더')}
  aria-live="polite"
>
  <div 
    role="group"
    aria-roledescription="slide"
    aria-label={`${currentIndex + 1} of ${banners.length}`}
  >
    {/* 배너 콘텐츠 */}
  </div>
  
  {/* 키보드 네비게이션 */}
  <div 
    role="tablist"
    aria-label={t('슬라이드 네비게이션')}
  >
    {banners.map((_, index) => (
      <button
        key={index}
        role="tab"
        aria-selected={index === currentIndex}
        aria-controls={`slide-${index}`}
        onClick={() => goToSlide(index)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToSlide(index);
          }
        }}
      >
        {t('슬라이드 {{number}}로 이동', { number: index + 1 })}
      </button>
    ))}
  </div>
</div>
```

## 외부 스킨 개발 및 배포

### 1. UMD 번들 빌드 설정

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main-banner-skin.js',
    library: 'MainBannerCustomSkin',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  // ... 기타 설정
};
```

### 2. 스킨 등록 방법

#### 수동 등록
```javascript
import { registerComponentSkin } from '@withcookie/webbuilder-sdk';

registerComponentSkin({
  id: 'custom-main-banner',
  name: '커스텀 메인배너',
  componentTypes: ['main_banner'],
  umdUrl: 'https://cdn.example.com/skins/main-banner-skin.js',
  globalName: 'MainBannerCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/main-banner-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '애니메이션 효과가 있는 메인배너',
  version: '1.0.0',
  author: 'Your Name'
});
```

#### API 기반 자동 등록
위드쿠키 스킨 마켓플레이스에 등록하면 자동으로 사용 가능합니다.

## 주의사항

1. **터치 이벤트**: 모바일에서 스와이프 제스처가 자동으로 처리됩니다
2. **에디터 모드**: 에디터 모드에서는 비디오 자동재생과 링크가 비활성화됩니다
3. **성능**: 많은 배너가 있을 때는 지연 로딩을 고려하세요
4. **반응형**: 모바일과 데스크톱에서 다른 높이와 버튼 크기를 지원합니다
5. **접근성**: 키보드 네비게이션과 ARIA 속성을 반드시 포함하세요
6. **무한 루프**: `infiniteLoop` 설정에 따라 첫/마지막 슬라이드 동작이 달라집니다
7. **비디오 배경**: 자동재생 정책으로 인해 음소거(`muted`)가 기본값입니다

## 액션 상세 설명

### goToNext / goToPrev
- **용도**: 슬라이드 이동
- **매개변수**: 없음
- **동작**: 전환 중이 아닐 때만 실행됨, 무한 루프 설정 고려

### goToSlide
- **용도**: 특정 슬라이드로 직접 이동
- **매개변수**: `index: number`
- **동작**: 같은 인덱스거나 전환 중일 때는 무시됨

### onMouseEnter / onMouseLeave
- **용도**: 호버 시 자동재생 일시정지/재개
- **매개변수**: 없음
- **동작**: `pauseOnHover` 설정이 true일 때만 동작

### onTouchStart / onTouchMove / onTouchEnd
- **용도**: 터치 스와이프 제스처 처리
- **매개변수**: 터치 이벤트 객체
- **동작**: 50px 이상 스와이프 시 슬라이드 변경

### onBannerClick
- **용도**: 배너 클릭 시 링크 이동
- **매개변수**: `banner: BannerItem`
- **동작**: 에디터 모드에서는 무시됨, 외부 링크는 새 탭에서 열림

## 스타일링 팁

### CSS 변수 활용
```css
:root {
  --banner-transition-duration: 500ms;
  --banner-arrow-size: 40px;
  --banner-dot-size: 12px;
  --banner-overlay-opacity: 0.3;
}

.main-banner-wrapper {
  --current-transition: var(--banner-transition-duration);
}
```

### 그라데이션 오버레이
```css
.banner-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    rgba(0, 0, 0, 0.3), 
    rgba(0, 0, 0, 0.1)
  );
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
}
```