import React from 'react';

// 스타일 import
import './brand-story-skin-scoped.css';

// Base64 이미지 import
import { BRAND_STORY_IMAGES } from './brand-story-images';

// FixedBgText API 문서에 맞춘 HtmlContent 타입 정의
interface HtmlContent {
    deviceProperty?: {
        pc: string;
        mobile: string;
    };
    html?: string;
}

// FixedBgText API 문서에 맞춘 ComponentSkinProps 인터페이스
interface ComponentSkinProps {
    data?: {
        // 기본 정보
        id?: string;
        style?: React.CSSProperties;
        componentProps?: object;
        content?: string | HtmlContent;
        
        // 이미지 및 콘텐츠
        imageUrl?: string;
        title?: string;
        description?: string;
        finalImageUrl?: string;
        finalTitle?: string;
        finalDescription?: string;
        htmlContent?: string;
        
        // 스타일 및 설정
        overlayStyle?: { backgroundColor: string };
        contentStyle?: { justifyContent: string };
        textColor?: string;
        htmlContentStyle?: { color: string };
        rootStyle?: React.CSSProperties;
        height?: number;
        overlayOpacity?: number;
        overlayColor?: string;
        contentAlignment?: 'top' | 'center' | 'bottom';
        
        // 상태
        isLoaded?: boolean;
        hasError?: boolean;
        componentRef?: React.RefObject<HTMLDivElement>;
        
        // 기타
        debug?: boolean;
        viewMode?: string;
        isPreview?: boolean;
        dataAttributes?: object;
        t?: (key: string) => string;
    };
    actions?: {
        // FixedBgText는 정적 컴포넌트로 액션이 없음
    };
    utils?: {
        t?: (key: string) => string;
        navigate?: (path: string) => void;
        formatCurrency?: (amount: number) => string;
        formatDate?: (date: string | Date) => string;
        getAssetUrl?: (path: string) => string;
        cx?: (...classes: (string | undefined | null | false)[]) => string;
    };
    mode?: 'editor' | 'preview' | 'production';
    editor?: {
        isSelected?: boolean;
    };
}

// 기본값 데이터
const DEFAULT_DATA = {
    title: 'Premium Life\nCommerce Brand',
    description: '마리쥬르는 단순한 인테리어 제품을 판매하는 것이 아니라,\n생활하는 공간의 질 높은 라이프 스타일을 디자인할 수 있도록 제안하는 브랜드입니다.\n감성적이고 트렌디한 상품으로 여러분의 공간이 채워지길 바라며,\n고객님과 소통하고 늘 고민하겠습니다.',
    imageUrl: {
        desktop: BRAND_STORY_IMAGES.desktop,
        mobile: BRAND_STORY_IMAGES.mobile
    },
    height: 400, // 기본 높이 (PC: 500px, 모바일: 400px 대신 단일값 사용)
    overlayColor: '#000000',
    overlayOpacity: 0.3,
    textColor: '#000000' // 검은색 텍스트
};

// HTML 콘텐츠 처리 함수
const getHtmlContent = (content: string | HtmlContent | undefined, isMobile: boolean = false): string => {
    if (!content) return '';
    
    if (typeof content === 'string') {
        return content;
    }
    
    // 디바이스별 콘텐츠 우선순위
    if (content.deviceProperty) {
        const deviceContent = isMobile ? content.deviceProperty.mobile : content.deviceProperty.pc;
        if (deviceContent) return deviceContent;
    }
    
    // 기본 HTML 콘텐츠
    return content.html || '';
};

// 현재 디바이스 감지 함수
const getIsMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
};

/**
 * BrandStorySkin 컴포넌트 - FixedBgText API 스펙 적용 (일반 배경 사용)
 *
 * 기능:
 * - FixedBgText API 문서 스펙 준수
 * - 일반 배경 이미지 (고정 배경 대신)
 * - HTML 콘텐츠 및 오버레이 지원
 * - 반응형 높이 및 텍스트 색상 설정
 * - 디바이스별 콘텐츠 지원
 */
const BrandStorySkin: React.FC<ComponentSkinProps> = (props = {}) => {
    const { 
        data = {}, 
        actions = {}, 
        utils = {}, 
        mode = 'production',
        editor = {}
    } = props;
    
    // 기본값과 props 병합
    const {
        id = 'brand-story-skin',
        finalImageUrl = data.imageUrl || DEFAULT_DATA.imageUrl.desktop,
        finalTitle = data.title || DEFAULT_DATA.title,
        finalDescription = data.description || DEFAULT_DATA.description,
        htmlContent = data.htmlContent || getHtmlContent(data.content, getIsMobile()),
        overlayColor = data.overlayColor || DEFAULT_DATA.overlayColor,
        overlayOpacity = data.overlayOpacity || DEFAULT_DATA.overlayOpacity,
        textColor = data.textColor || DEFAULT_DATA.textColor,
        height = data.height || DEFAULT_DATA.height,
        contentAlignment = data.contentAlignment || 'center',
        componentRef = data.componentRef,
        debug = data.debug || false,
        isLoaded = data.isLoaded !== false,
        hasError = data.hasError || false,
        dataAttributes = data.dataAttributes || {},
        t = data.t || utils.t || ((key: string) => key)
    } = data;
    
    // 모바일 감지
    const [isMobile, setIsMobile] = React.useState(getIsMobile());
    
    React.useEffect(() => {
        const handleResize = () => setIsMobile(getIsMobile());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // 배경 이미지 URL 결정 (디바이스별)
    const backgroundImageUrl = React.useMemo(() => {
        if (data.imageUrl) return data.imageUrl;
        return isMobile ? DEFAULT_DATA.imageUrl.mobile : DEFAULT_DATA.imageUrl.desktop;
    }, [data.imageUrl, isMobile]);
    
    // 스타일 계산
    const rootStyle: React.CSSProperties = {
        position: 'relative',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        // 고정 배경 제거 - 일반 배경 사용
        // backgroundAttachment: 'fixed', // 이 라인을 제거
        minHeight: `${height}px`,
        width: '100%',
        ...data.rootStyle
    };
    
    const overlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlayColor,
        opacity: overlayOpacity,
        ...data.overlayStyle
    };
    
    const contentStyle: React.CSSProperties = {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: contentAlignment === 'top' ? 'flex-start' : 
                       contentAlignment === 'bottom' ? 'flex-end' : 'center',
        height: '100%',
        padding: '7.5vh 1rem',
        textAlign: 'center',
        color: textColor,
        ...data.contentStyle
    };
    
    const htmlContentStyle: React.CSSProperties = {
        color: textColor,
        ...data.htmlContentStyle
    };
    
    // 로딩 및 에러 상태 처리
    if (!isLoaded) {
        return (
            <div className="bs-skin-loading" style={{ minHeight: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: textColor }}>{t('로딩 중...')}</p>
            </div>
        );
    }
    
    if (hasError) {
        return (
            <div className="bs-skin-error" style={{ minHeight: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: textColor }}>{t('이미지를 로드할 수 없습니다.')}</p>
            </div>
        );
    }

    return (
        <section 
            id={id}
            className="bs-skin-globalWrapper bs-skin-py-8 bs-skin-md-py-10"
            ref={componentRef}
            style={rootStyle}
            {...dataAttributes}
        >
            {/* 오버레이 */}
            <div className="bs-skin-overlay" style={overlayStyle} />
            
            {/* 콘텐츠 */}
            <div className="bs-skin-content" style={contentStyle}>
                {htmlContent ? (
                    <div 
                        className="bs-skin-html-content" 
                        style={htmlContentStyle}
                        dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    />
                ) : (
                    <div>
                        <h2 className="bs-skin-font-serif bs-skin-leading-heading bs-skin-whitespace-pre-line bs-skin-text-xl">
                            {t(finalTitle)}
                        </h2>
                        <p className="bs-skin-leading-body bs-skin-whitespace-pre-line bs-skin-mt-3 bs-skin-text-sm">
                            {t(finalDescription)}
                        </p>
                    </div>
                )}
            </div>
            
            {/* 디버그 정보 */}
            {debug && (
                <div className="bs-skin-debug-info" style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '10px',
                    fontSize: '12px',
                    zIndex: 999
                }}>
                    <p>Image URL: {backgroundImageUrl}</p>
                    <p>Is Mobile: {isMobile ? 'Yes' : 'No'}</p>
                    <p>Height: {height}px</p>
                    <p>Overlay: {overlayColor} ({overlayOpacity})</p>
                </div>
            )}
            
            {/* 에디터 힌트 */}
            {mode === 'editor' && editor?.isSelected && (
                <div className="bs-skin-editor-hint" style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 123, 255, 0.9)',
                    color: 'white',
                    padding: '5px 10px',
                    fontSize: '12px',
                    borderRadius: '3px',
                    zIndex: 999
                }}>
                    {t('브랜드 스토리 컴포넌트')}
                </div>
            )}
        </section>
    );
};

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(BrandStorySkin as any).SAMPLE_DATA = DEFAULT_DATA;

// 기본 익스포트
export default BrandStorySkin;

// 명명된 익스포트 (하위 호환성)
export { BrandStorySkin, BrandStorySkin as BrandStory };