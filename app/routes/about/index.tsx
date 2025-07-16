import { CenteredVisualBanner } from '@/components/ui/banner/CenteredVisualBanner';
import { SplitVisualBanner } from '@/components/ui/banner/SplitVisualBanner';

export function meta() {
    return [
        {
            title: '회사 소개 - Marijour',
        },
        {
            name: 'description',
            content: 'Marijour는 프리미엄 라이프스타일을 제안하는 브랜드입니다. 키친&다이닝, 바디케어, 침실&패브릭까지 모든 생활용품을 한곳에서 만나보세요.',
        },
        {
            name: 'keywords',
            content: '마리쥬르, 회사소개, 브랜드스토리, 프리미엄, 라이프스타일, 생활용품',
        },
    ];
}

/**
 * About 페이지 - 회사 소개
 * 브랜드 스토리와 비전을 비주얼 배너로 전달
 */
export default function About() {
    return (
        <div>
            <section className="hidden">
                <h2 className="font-serif text-3xl leading-heading mb-6">회사 소개</h2>
            </section>
            <section className="w-full h-[calc(75vh-102.59px)] mb-5">
                <CenteredVisualBanner
                    src={{
                        desktop: '/images/about-01-desktop.jpg',
                        mobile: '/images/about-01-mobile.jpg',
                    }}
                    title="Premium Life
                                Commerce Brand"
                    description="마리쥬르는 단순한 인테리어
                                제품을 판매하는 것이 아니라,
                                생활하는 공간의 질 높은 라이프 스타일을
                                디자인할 수 있도록 제안하는 브랜드입니다."
                />
            </section>
            <section className="globalWrapper py-8 md:py-10">
                <SplitVisualBanner
                    src={{
                        desktop: '/images/about-02.jpg',
                        mobile: '/images/about-02.jpg',
                    }}
                    title="오늘 밤 나를 채우는 에너지"
                    description="현실을 떠나 온전히 나만의 세계로 빠져드는 시간,
                가볍고 부드러운 파자마와 침구 셋트는 당신의 에너지를 채워줄 좋은 재표입니다.
                가뿐한 마음으로 마리쥬르와 꿈 속으로 떠날 채비를 시작해보세요."
                    imageDirection="left"
                />
            </section>
            <section className="globalWrapper py-8 md:py-10">
                <SplitVisualBanner
                    src={{
                        desktop: '/images/about-03.jpg',
                        mobile: '/images/about-03.jpg',
                    }}
                    title="일상을 살아가게 하는 에너지"
                    description="한 숨이라는 무거운 것을 버리고 걱정이라는 것의 부피를 줄여 따뜻한 시선과 조그마한 여유를 챙겨보세요.
                    일상을 여행할 마음의 준비가 될거랍니다. 저희 마리쥬르는 당신의 마음을 데워줄 일상의 것들에 숨을 불어 넣어둘게요. 축적된 일상을 지내다 보면 당신은 마리쥬르의 소중함을 느끼게 될거에요."
                    imageDirection="right"
                />
            </section>
            <section className="globalWrapper h-[64vh] py-8 md:py-10">
                <CenteredVisualBanner
                    src={{
                        desktop: '/images/about-04.jpg',
                        mobile: '/images/about-04.jpg',
                    }}
                    title="그날, 따뜻한 사람과의 일상"
                    description="마리쥬르가 더 궁금하시다면
                                마리쥬르 인스타그램에 방문해주세요.
                                더 따뜻하고 감각적인 우리의
                                많은 일상을 소개할게요!"
                    buttonText="인스타그램"
                    buttonLink="/#"
                />
            </section>
        </div>
    );
}
