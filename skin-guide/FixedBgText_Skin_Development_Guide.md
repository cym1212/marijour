# 고정 배경 텍스트 스킨 개발 가이드

이 가이드는 웹빌더의 고정 배경 텍스트(FixedBgText) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 컴포넌트 개요

FixedBgText는 배경 이미지 위에 텍스트나 HTML 콘텐츠를 표시하는 컴포넌트입니다. 패럴랙스 스크롤 효과, 페이드인 애니메이션, 오버레이 색상 조정 등 다양한 시각적 효과를 지원합니다.

## 데이터 구조

### HTML 콘텐츠 타입 (HtmlContent)

```typescript
interface HtmlContent {
  html?: string;                // HTML 내용
  imageUrl?: string;            // 이미지 URL (레거시)
  title?: string;               // 제목 (레거시)
  description?: string;         // 설명 (레거시)
  deviceProperty?: {            // 디바이스별 설정
    pc?: string;                // PC용 HTML
    mobile?: string;            // 모바일용 HTML
    [key: string]: string | undefined;
  };
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
    
    // FixedBgTextLogic에서 반환된 모든 필드가 직접 포함됨
    isVisible: boolean;                    // 뷰포트에 보이는지 여부
    scrollProgress: number;                // 스크롤 진행도 (0~1)
    backgroundStyle: {                     // 배경 스타일
      backgroundImage: string;
      backgroundPosition: string;
      backgroundSize: string;
      backgroundAttachment: string;
      backgroundRepeat: string;
    };
    overlayStyle: {                        // 오버레이 스타일
      backgroundColor: string;             // RGBA 형식
    };
    contentStyle: {                        // 콘텐츠 스타일
      color: string;
      maxWidth: string;
      padding: string;
      alignItems: string;
      textAlign: string;
    };
    containerHeight: {                     // 컨테이너 높이
      height: string;
      minHeight: string;
      maxHeight: string;
    };
    parallaxOffset: number;                // 패럴랙스 오프셋 (px)
    content: string;                       // HTML 콘텐츠
    bgImageUrl: string;                    // 배경 이미지 URL
    overlayColor: string;                  // 오버레이 색상
    overlayOpacity: number;                // 오버레이 투명도 (0~1)
    textColor: string;                     // 텍스트 색상
    contentAlignment: string;              // 콘텐츠 정렬 (left, center, right)
    height: number;                        // 높이 (px)
    enableParallax: boolean;               // 패럴랙스 효과 활성화
    fadeInOnScroll: boolean;               // 스크롤 시 페이드인
    isEditorMode: boolean;                 // 에디터 모드 여부
    isPreviewMode: boolean;                // 프리뷰 모드 여부
    
    // 기타 데이터
    [key: string]: any;
  };
  
  // FixedBgTextLogic에서는 actions를 반환하지 않음 (상태와 스타일만 관리)
  actions: {
    // 현재 FixedBgText는 사용자 인터랙션 액션이 없음
    // 향후 추가될 수 있음 (예: 클릭 이벤트, 스크롤 트리거 등)
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    bgImageUrl?: string;                   // 배경 이미지 URL
    overlayColor?: string;                 // 오버레이 색상
    overlayOpacity?: number;               // 오버레이 투명도 (0~1)
    textColor?: string;                    // 텍스트 색상
    contentAlignment?: 'left' | 'center' | 'right'; // 콘텐츠 정렬
    height?: number;                       // 높이 (px)
    minHeight?: number;                    // 최소 높이 (px)
    maxHeight?: string;                    // 최대 높이
    contentMaxWidth?: string;              // 최대 콘텐츠 너비
    contentPadding?: string;               // 콘텐츠 패딩
    backgroundPosition?: string;           // 배경 위치
    backgroundSize?: string;               // 배경 크기
    disableParallax?: boolean;             // 패럴랙스 비활성화
    parallaxSpeed?: number;                // 패럴랙스 속도 (0~2)
    fadeInOnScroll?: boolean;              // 스크롤 시 페이드인
    style?: React.CSSProperties;           // 추가 스타일
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

FixedBgText 컴포넌트는 다음과 같은 방식으로 데이터를 받습니다:

1. **Property Panel**: 에디터에서 설정한 시각적 옵션값 (options 객체로 전달)
2. **Content**: HTML 콘텐츠 (data.content로 전달)
3. **Scroll State**: 스크롤 상태와 진행도 (data 객체에 병합)
4. **Computed Styles**: 계산된 스타일 값들 (data 객체에 병합)

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MyFixedBgTextSkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  const { t, cx } = utils;
  
  // 데이터 추출
  const {
    isVisible,
    scrollProgress,
    backgroundStyle,
    overlayStyle,
    contentStyle,
    containerHeight,
    parallaxOffset,
    content,
    enableParallax,
    fadeInOnScroll,
    isEditorMode
  } = data;
  
  // 에디터 정보
  const { isSelected, onSelect, dragHandleProps } = editor || {};
  
  // 패럴랙스 배경 스타일
  const parallaxBackgroundStyle = enableParallax ? {
    ...backgroundStyle,
    transform: `translateY(${parallaxOffset}px)`
  } : backgroundStyle;
  
  // 페이드인 효과를 위한 opacity
  const fadeOpacity = fadeInOnScroll && !isEditorMode ? 
    Math.min(1, scrollProgress * 2) : 1;
  
  return (
    <div 
      id={data.id}
      className={cx(
        'fixed-bg-text-container',
        isSelected && 'selected',
        isVisible && 'visible',
        options.className
      )}
      style={{
        ...options.style,
        ...containerHeight,
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={onSelect}
      {...dragHandleProps}
    >
      {/* 배경 이미지 레이어 */}
      <div 
        className="fixed-bg-image"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...parallaxBackgroundStyle,
          zIndex: 0
        }}
      />
      
      {/* 오버레이 레이어 */}
      <div 
        className="fixed-bg-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...overlayStyle,
          zIndex: 1
        }}
      />
      
      {/* 콘텐츠 레이어 */}
      <div 
        className="fixed-bg-content"
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 2,
          ...contentStyle,
          opacity: fadeOpacity,
          transform: fadeInOnScroll && !isEditorMode ? 
            `translateY(${20 - (scrollProgress * 20)}px)` : 'none',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <div 
          className="fixed-bg-text"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      
      {/* 에디터 모드 오버레이 */}
      {isEditorMode && (
        <div 
          className="editor-mode-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            border: '2px dashed rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <div 
            className="editor-info"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
            }}
          >
            <span className="component-type" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold' }}>
              {t('고정 배경 텍스트')}
            </span>
            <span className="helper-text" style={{ display: 'block', fontSize: '14px', marginTop: '4px' }}>
              {t('더블클릭하여 텍스트 편집')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFixedBgTextSkin;
```

## 패럴랙스 효과 구현

### 기본 패럴랙스

```typescript
// 패럴랙스 배경 적용
const parallaxStyle = enableParallax ? {
  transform: `translateY(${parallaxOffset}px)`,
  willChange: 'transform' // 성능 최적화
} : {};

// 멀티 레이어 패럴랙스
const MultiLayerParallax = () => (
  <>
    {/* 배경 레이어 (느림) */}
    <div 
      style={{
        ...backgroundStyle,
        transform: `translateY(${parallaxOffset * 0.5}px)`
      }}
    />
    
    {/* 중간 레이어 (보통) */}
    <div 
      style={{
        ...middleLayerStyle,
        transform: `translateY(${parallaxOffset * 0.8}px)`
      }}
    />
    
    {/* 전경 레이어 (빠름) */}
    <div 
      style={{
        ...foregroundStyle,
        transform: `translateY(${parallaxOffset}px)`
      }}
    />
  </>
);
```

### 고급 스크롤 효과

```typescript
// 스크롤 진행도에 따른 효과
const ScrollEffects = () => {
  // 스케일 효과
  const scale = 1 + (scrollProgress * 0.1);
  
  // 블러 효과
  const blur = Math.max(0, 1 - scrollProgress) * 5;
  
  // 밝기 효과
  const brightness = 0.5 + (scrollProgress * 0.5);
  
  return (
    <div 
      className="scroll-effects-container"
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px) brightness(${brightness})`,
        transition: 'all 0.3s ease-out'
      }}
    >
      {/* 콘텐츠 */}
    </div>
  );
};
```

## 페이드인 애니메이션

### 기본 페이드인

```typescript
// 페이드인 효과
const fadeInStyle = fadeInOnScroll && !isEditorMode ? {
  opacity: Math.min(1, scrollProgress * 2),
  transform: `translateY(${20 - (scrollProgress * 20)}px)`,
  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
} : {
  opacity: 1,
  transform: 'none'
};
```

### 단계별 페이드인

```typescript
// 순차적 페이드인
const SequentialFadeIn = () => {
  const items = content.split('<br>');
  
  return (
    <>
      {items.map((item, index) => {
        const itemDelay = index * 0.1;
        const itemProgress = Math.max(0, scrollProgress - itemDelay);
        
        return (
          <div
            key={index}
            style={{
              opacity: Math.min(1, itemProgress * 3),
              transform: `translateY(${20 - (itemProgress * 20)}px)`,
              transition: `all 0.6s ease-out ${itemDelay}s`
            }}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        );
      })}
    </>
  );
};
```

## 반응형 디자인

### 디바이스별 스타일

```typescript
// 반응형 유틸리티
const useResponsive = () => {
  const [deviceType, setDeviceType] = useState('desktop');
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width <= 768) setDeviceType('mobile');
      else if (width <= 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return deviceType;
};

// 반응형 스타일 적용
const ResponsiveFixedBgText = () => {
  const deviceType = useResponsive();
  
  const responsiveHeight = {
    mobile: '400px',
    tablet: '500px',
    desktop: containerHeight.height
  };
  
  const responsivePadding = {
    mobile: '40px 16px',
    tablet: '50px 20px',
    desktop: contentStyle.padding
  };
  
  return (
    <div 
      style={{
        ...containerHeight,
        height: responsiveHeight[deviceType],
        padding: responsivePadding[deviceType]
      }}
    >
      {/* 콘텐츠 */}
    </div>
  );
};
```

### CSS 미디어 쿼리

```css
/* 모바일 */
@media (max-width: 768px) {
  .fixed-bg-text-container {
    min-height: 400px !important;
  }
  
  .fixed-bg-content {
    padding: 40px 16px !important;
  }
  
  .fixed-bg-text h1 {
    font-size: 28px;
  }
  
  .fixed-bg-text h2 {
    font-size: 24px;
  }
  
  .fixed-bg-text p {
    font-size: 16px;
  }
}

/* 태블릿 */
@media (max-width: 1024px) {
  .fixed-bg-content {
    padding: 50px 20px;
  }
  
  .fixed-bg-text h1 {
    font-size: 32px;
  }
}
```

## 콘텐츠 정렬

### 다양한 정렬 옵션

```typescript
// 정렬 스타일 맵
const alignmentStyles = {
  'top-left': {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'left'
  },
  'top-center': {
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'center'
  },
  'top-right': {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    textAlign: 'right'
  },
  'center-left': {
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left'
  },
  'center': {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  'center-right': {
    justifyContent: 'center',
    alignItems: 'flex-end',
    textAlign: 'right'
  },
  'bottom-left': {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    textAlign: 'left'
  },
  'bottom-center': {
    justifyContent: 'flex-end',
    alignItems: 'center',
    textAlign: 'center'
  },
  'bottom-right': {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right'
  }
};

// 사용 예제
<div 
  className="content-wrapper"
  style={{
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...alignmentStyles[contentAlignment] || alignmentStyles['center']
  }}
>
  {/* 콘텐츠 */}
</div>
```

## 오버레이 효과

### 그라데이션 오버레이

```typescript
// 그라데이션 오버레이
const GradientOverlay = () => (
  <div 
    className="gradient-overlay"
    style={{
      background: `linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.3) 50%,
        rgba(0, 0, 0, 0.7) 100%
      )`
    }}
  />
);

// 방향별 그라데이션
const DirectionalGradient = ({ direction = 'bottom' }) => {
  const gradients = {
    top: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
    bottom: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
    left: 'linear-gradient(to left, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
    right: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
    radial: 'radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.8) 100%)'
  };
  
  return (
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        background: gradients[direction]
      }}
    />
  );
};
```

## 고급 효과

### 비디오 배경

```typescript
// 비디오 배경 지원
const VideoBackground = ({ videoUrl, posterUrl }) => (
  <video
    autoPlay
    muted
    loop
    playsInline
    poster={posterUrl || data.bgImageUrl}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
      transform: 'translate(-50%, -50%)',
      objectFit: 'cover'
    }}
  >
    <source src={videoUrl} type="video/mp4" />
  </video>
);
```

### 마스크 효과

```typescript
// SVG 마스크
const MaskEffect = () => (
  <>
    <svg width="0" height="0">
      <defs>
        <mask id="textMask">
          <rect width="100%" height="100%" fill="white" />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="120"
            fontWeight="bold"
            fill="black"
          >
            MASKED
          </text>
        </mask>
      </defs>
    </svg>
    
    <div 
      style={{
        ...backgroundStyle,
        mask: 'url(#textMask)',
        WebkitMask: 'url(#textMask)'
      }}
    />
  </>
);
```

## 성능 최적화

### 이미지 최적화

```typescript
// 이미지 지연 로딩
const LazyBackground = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = data.bgImageUrl;
  }, [data.bgImageUrl]);
  
  return (
    <div 
      style={{
        ...backgroundStyle,
        opacity: imageLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in'
      }}
    />
  );
};

// 저화질 이미지 프리로드
const ProgressiveImage = ({ lowQualityUrl, highQualityUrl }) => {
  const [currentUrl, setCurrentUrl] = useState(lowQualityUrl);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setCurrentUrl(highQualityUrl);
    img.src = highQualityUrl;
  }, [highQualityUrl]);
  
  return (
    <div 
      style={{
        backgroundImage: `url(${currentUrl})`,
        filter: currentUrl === lowQualityUrl ? 'blur(5px)' : 'none',
        transition: 'filter 0.5s ease-out'
      }}
    />
  );
};
```

### 스크롤 최적화

```typescript
// 스크롤 이벤트 쓰로틀링
const useThrottledScroll = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRun = useRef(Date.now());
  
  useEffect(() => {
    const handleScroll = () => {
      if (Date.now() - lastRun.current >= delay) {
        callback();
        lastRun.current = Date.now();
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          callback();
          lastRun.current = Date.now();
        }, delay);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, delay]);
};
```

## 접근성 고려사항

```typescript
// 접근성 향상
const AccessibleFixedBgText = () => (
  <section
    role="region"
    aria-label={t('고정 배경 섹션')}
    style={containerStyle}
  >
    {/* 스크린 리더를 위한 숨김 제목 */}
    <h2 className="sr-only">{t('배경 이미지 섹션')}</h2>
    
    {/* 배경 이미지 설명 */}
    <div 
      role="img"
      aria-label={t('장식용 배경 이미지')}
      style={backgroundStyle}
    />
    
    {/* 메인 콘텐츠 */}
    <article
      className="content"
      style={contentStyle}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  </section>
);
```

## 외부 스킨 개발 및 배포

### 1. UMD 번들 빌드 설정

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'fixed-bg-text-skin.js',
    library: 'FixedBgTextCustomSkin',
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
  id: 'custom-fixed-bg-text',
  name: '커스텀 고정 배경 텍스트',
  componentTypes: ['fixed_bg_text'],
  umdUrl: 'https://cdn.example.com/skins/fixed-bg-text-skin.js',
  globalName: 'FixedBgTextCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/fixed-bg-text-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '패럴랙스 효과가 강화된 고정 배경 텍스트',
  version: '1.0.0',
  author: 'Your Name'
});
```

#### API 기반 자동 등록
위드쿠키 스킨 마켓플레이스에 등록하면 자동으로 사용 가능합니다.

## 주의사항

1. **에디터 모드**: 에디터에서는 패럴랙스 효과가 비활성화됩니다 (backgroundAttachment: 'scroll')
2. **스크롤 성능**: 스크롤 이벤트는 쓰로틀링하여 성능을 최적화하세요
3. **이미지 크기**: 큰 배경 이미지는 로딩 시간에 영향을 미칠 수 있습니다
4. **모바일 대응**: 모바일에서는 `background-attachment: fixed`가 제대로 작동하지 않을 수 있습니다
5. **접근성**: 배경 이미지는 장식용임을 명시하고, 중요한 정보는 텍스트로 제공하세요
6. **브라우저 호환성**: 패럴랙스 효과는 구형 브라우저에서 제한될 수 있습니다

## 프로퍼티 패널 옵션 상세

### 시각적 옵션
- **bgImageUrl**: 배경 이미지 URL
- **overlayColor**: 오버레이 색상 (HEX 형식)
- **overlayOpacity**: 오버레이 투명도 (0~1)
- **textColor**: 텍스트 색상 (HEX 형식)

### 레이아웃 옵션
- **contentAlignment**: 콘텐츠 정렬 (left, center, right)
- **height**: 섹션 높이 (px)
- **minHeight**: 최소 높이 (px)
- **maxHeight**: 최대 높이 (CSS 단위)
- **contentMaxWidth**: 콘텐츠 최대 너비
- **contentPadding**: 콘텐츠 패딩

### 배경 옵션
- **backgroundPosition**: 배경 위치 (top, center, bottom)
- **backgroundSize**: 배경 크기 (cover, contain, 100% 100%)

### 효과 옵션
- **disableParallax**: 패럴랙스 효과 비활성화
- **parallaxSpeed**: 패럴랙스 속도 (0~2, 기본값 0.5)
- **fadeInOnScroll**: 스크롤 시 페이드인 효과

## 스타일링 팁

### CSS 변수 활용
```css
.fixed-bg-text-container {
  --overlay-opacity: 0.5;
  --text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  --content-max-width: 1200px;
  --transition-duration: 0.6s;
}

.fixed-bg-overlay {
  opacity: var(--overlay-opacity);
}

.fixed-bg-text {
  text-shadow: var(--text-shadow);
  max-width: var(--content-max-width);
  transition: all var(--transition-duration) ease-out;
}
```

### 타이포그래피 스타일
```css
.fixed-bg-text h1,
.fixed-bg-text h2,
.fixed-bg-text h3 {
  margin-bottom: 1em;
  line-height: 1.2;
  font-weight: bold;
}

.fixed-bg-text p {
  margin-bottom: 1.5em;
  line-height: 1.6;
  opacity: 0.9;
}

.fixed-bg-text a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.2s ease;
}

.fixed-bg-text a:hover {
  opacity: 0.8;
}
```