import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { KeyVisualSlider } from '@/components/ui/slider/KeyVisualSlider';
import { QuickMenu } from '@/components/ui/nav/QuickMenu';
import { TextBanner } from '@/components/ui/banner/TextBanner';
import { ProductSlider } from '@/components/ui/product/ProductSlider';
import { SliderTitle } from '@/components/ui/slider/SliderTitle';
import { SplitVisualBanner } from '@/components/ui/banner/SplitVisualBanner';
import { CenteredVisualBanner } from '@/components/ui/banner/CenteredVisualBanner';

import { SLIDE_MOCK_DATA } from '@/constants/slide';
import { PRODUCT_MOCK_DATA } from '@/constants/product';

gsap.registerPlugin(useGSAP);

export function meta() {
    return [
        {
            title: 'Marijour - 프리미엄 라이프스타일 쇼핑몰',
        },
        {
            name: 'description',
            content: '키친&다이닝, 바디케어, 침실&패브릭까지 모든 생활용품을 한곳에서. 마리쥬르와 함께하는 새로운 라이프스타일',
        },
        {
            name: 'keywords',
            content: '마리쥬르, 쇼핑몰, 생활용품, 키친, 다이닝, 바디케어, 침실, 패브릭, 홈데코',
        },
    ];
}

/**
 * Home 페이지 - 메인 홈페이지
 * 키 비주얼, 퀵메뉴, 배너, 베스트 상품 등 주요 콘텐츠 표시
 */

export default function Home() {
    useGSAP(() => {
        gsap.to('.homeContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="homeContainer opacity-0">
            <section className="w-full py-5 pt-0 md:pb-10 h-[69.3vmax] md:h-[68.4vh]">
                <KeyVisualSlider data={SLIDE_MOCK_DATA} />
            </section>
            <section className="w-full px-0 py-5 md:py-10">
                <QuickMenu />
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 globalWrapper py-5 md:py-10">
                <div className="w-full aspect-[3/1]">
                    <TextBanner
                        src={{
                            desktop: '/images/text-banner-1.jpg',
                            mobile: '/images/text-banner-1.jpg',
                        }}
                        title="지속 가능한 환경을 위해"
                        description="5만원 이상 구매시 에코 네트백을 드려요."
                        buttonLink="/shop"
                    />
                </div>
                <div className="w-full aspect-[3/1]">
                    <TextBanner
                        src={{
                            desktop: '/images/text-banner-2.jpg',
                            mobile: '/images/text-banner-2.jpg',
                        }}
                        title="신제품 출시 5% 할인"
                        description="신제품 출시 기념 5% 할인"
                        buttonLink="/shop"
                    />
                </div>
            </section>
            <section className="globalWrapper py-10 md:py-15 mb-5">
                <div className="py-5 md:py-0">
                    <SliderTitle
                        title="베스트 상품"
                        description="마리쥬르 베스트 상품을 소개합니다."
                    />
                    <ProductSlider
                        data={PRODUCT_MOCK_DATA}
                        desktopSlidesPerView={3}
                    />
                </div>
            </section>
            <section className="globalWrapper py-10 md:py-20">
                <SplitVisualBanner
                    title="단비같은 '꿀잠' 선사하기."
                    description="깊은 밤에서 양을 세는 것도 지쳐버린 어느밤 지친 하루를 정리하고 내일 다시 아침을 맞이할 생각에 피로감은 더 몰려오죠. 마음속 평안함을 선사하는 아로마테라피를 추천합니다."
                    src={{
                        desktop: '/images/main-split-1.jpg',
                        mobile: '/images/main-split-1.jpg',
                    }}
                    buttonText="자세히 보기"
                    buttonLink="/shop"
                />
            </section>
            <section className="globalWrapper py-10 md:py-15 mb-5">
                <div className="py-5 md:py-0">
                    <SliderTitle
                        title="키친&다이닝"
                        description="즐거움을 조리하는 마리쥬르 키친 용품"
                    />
                    <ProductSlider
                        data={PRODUCT_MOCK_DATA}
                        mobileSlidesPerView={2}
                        desktopSlidesPerView={4}
                    />
                </div>
            </section>
            <section className="globalWrapper py-10 md:py-15 mb-5">
                <div className="py-5 md:py-0">
                    <SliderTitle
                        title="바디케어"
                        description="일상의 무게를 줄여주는 마리쥬르 바디케어"
                    />
                    <ProductSlider
                        data={PRODUCT_MOCK_DATA}
                        mobileSlidesPerView={2}
                        desktopSlidesPerView={4}
                    />
                </div>
            </section>
            <section className="globalWrapper py-10 md:py-15 mb-5">
                <div className="py-5 md:py-0">
                    <SliderTitle
                        title="침실&패브릭"
                        description="지친 하루를 따뜻하게 감싸주는 나만의 공간"
                    />
                    <ProductSlider
                        data={PRODUCT_MOCK_DATA}
                        mobileSlidesPerView={2}
                        desktopSlidesPerView={4}
                    />
                </div>
            </section>
            <section className="globalWrapper py-10">
                <div className="aspect-[3/4] md:aspect-[3/1]">
                    <CenteredVisualBanner
                        src={{
                            desktop: '/images/main-bottom-banner.jpg',
                            mobile: '/images/main-bottom-banner.jpg',
                        }}
                        title="Premium Life
                    Commerce Brand"
                        description="마리쥬르는 단순한 인테리어 제품을 판매하는 것이 아니라,
                                생활하는 공간의 질 높은 라이프 스타일을 디자인할 수 있도록 제안하는 브랜드입니다.
                                감성적이고 트렌디한 상품으로 여러분의 공간이 채워지길 바라며,
                                고객님과 소통하고 늘 고민하겠습니다."
                        buttonText="브랜드 스토리"
                        buttonLink="/about"
                        isSmallText
                    />
                </div>
            </section>
        </div>
    );
}
