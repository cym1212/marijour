import React from 'react';

// 스타일 import
import './brand-story-skin-scoped.css';

// Base64 이미지 import
import { BRAND_STORY_IMAGES } from './brand-story-images';

// Mock 데이터 (번들에 포함)
const BRAND_STORY_DATA = {
    title: 'Premium Life\nCommerce Brand',
    description: '마리쥬르는 단순한 인테리어 제품을 판매하는 것이 아니라,\n생활하는 공간의 질 높은 라이프 스타일을 디자인할 수 있도록 제안하는 브랜드입니다.\n감성적이고 트렌디한 상품으로 여러분의 공간이 채워지길 바라며,\n고객님과 소통하고 늘 고민하겠습니다.',
    buttonText: '브랜드 스토리',
    buttonLink: '/about',
    imageUrl: {
        desktop: BRAND_STORY_IMAGES.desktop,
        mobile: BRAND_STORY_IMAGES.mobile
    }
};

/**
 * BrandStorySkin 컴포넌트 - 브랜드 스토리 오버레이 UMD 버전
 *
 * 기능:
 * - 전체 화면 오버레이 레이아웃
 * - 중앙 정렬된 텍스트 콘텐츠
 * - primary 색상 버튼
 * - 완전히 독립적인 컴포넌트 (props 없음)
 */
export function BrandStory() {
    // 동적으로 스타일 태그를 추가하여 배경 이미지 적용
    React.useEffect(() => {
        const styleId = 'brand-story-bg-styles';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.innerHTML = `
                .bs-skin-wrapper {
                    background-image: url('${BRAND_STORY_DATA.imageUrl.desktop}');
                }
                @media (max-width: 1023px) {
                    .bs-skin-wrapper {
                        background-image: url('${BRAND_STORY_DATA.imageUrl.mobile}');
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        return () => {
            // 컴포넌트 언마운트 시 스타일 제거
            const style = document.getElementById(styleId);
            if (style) {
                style.remove();
            }
        };
    }, []);

    return (
        <section className="bs-skin-globalWrapper bs-skin-py-8 bs-skin-md-py-10">
            <div className="bs-skin-relative bs-skin-h-64vh">
                <div className="bs-skin-wrapper bs-skin-absolute bs-skin-inset-0 bs-skin-bg-cover bs-skin-bg-center bs-skin-bg-no-repeat"></div>
                <div className="bs-skin-absolute bs-skin-left-0 bs-skin-top-0 bs-skin-w-full bs-skin-h-full bs-skin-py-7-5vh bs-skin-flex bs-skin-flex-col bs-skin-items-center bs-skin-justify-center bs-skin-text-center bs-skin-text-black">
                    <div>
                        <h2 className="bs-skin-font-serif bs-skin-leading-heading bs-skin-whitespace-pre-line bs-skin-text-xl">
                            {BRAND_STORY_DATA.title}
                        </h2>
                        <p className="bs-skin-leading-body bs-skin-whitespace-pre-line bs-skin-mt-3 bs-skin-text-sm">
                            {BRAND_STORY_DATA.description}
                        </p>
                    </div>
                    <button 
                        className="bs-skin-bg-primary bs-skin-px-4 bs-skin-pt-2-5 bs-skin-pb-3-5 bs-skin-hover-bg-primary-80 bs-skin-mt-6-5" 
                        type="button" 
                        aria-label="브랜드 스토리"
                    >
                        <a 
                            className="bs-skin-text-sm bs-skin-text-white" 
                            href={BRAND_STORY_DATA.buttonLink}
                            data-discover="true"
                        >
                            {BRAND_STORY_DATA.buttonText}
                        </a>
                    </button>
                </div>
            </div>
        </section>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(BrandStory as any).SAMPLE_DATA = BRAND_STORY_DATA;

export default BrandStory;