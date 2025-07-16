import { useRef } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Autoplay, Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import { BannerImage } from '@/components/ui/banner/BannerImage';
import { SliderNavigationButton } from '@/components/ui/slider/SliderNavigationButton';

import type { KeyVisualSliderData } from '@/types/ui';

export function KeyVisualSlider({ data }: { data: KeyVisualSliderData[] }) {
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);

    return (
        <div className="keyVisualSlider globalWrapper relative w-full h-full">
            <Swiper
                modules={[EffectFade, Navigation, Autoplay, Scrollbar]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                slidesPerView={1}
                speed={800}
                scrollbar={{
                    draggable: true,
                }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNextRef.current;
                    }
                }}
                className="h-full group"
            >
                {data.map((slide, idx) => (
                    <SwiperSlide key={slide.title + idx}>
                        <div className="overflow-hidden flex justify-center items-center w-full h-full relative">
                            <BannerImage
                                src={{
                                    desktop: slide.imageUrl.desktop,
                                    mobile: slide.imageUrl.mobile,
                                }}
                            />
                            <div className="globalWrapper absolute left-0 top-0 w-full h-full px-5 md:px-10 py-[7.5vh] flex flex-col items-start justify-end text-white">
                                <div>
                                    <h3 className="font-serif text-3xl leading-heading whitespace-pre-line">{slide.title}</h3>
                                    <p className="leading-body whitespace-pre-line mt-3">{slide.description}</p>
                                </div>
                                <button
                                    className="bg-primary px-4 pt-2.5 pb-3.5 hover-bg-primary-80 mt-6.5"
                                    type="button"
                                    aria-label="자세히 보기"
                                >
                                    <Link
                                        to={'/#'}
                                        className="font-pretendard text-sm text-white"
                                    >
                                        자세히 보기
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* 내비게이션 버튼 */}
                <SliderNavigationButton
                    ref={navigationPrevRef}
                    direction="prev"
                    rotate="-90"
                    hoverColor="white"
                />
                <SliderNavigationButton
                    ref={navigationNextRef}
                    direction="next"
                    rotate="90"
                    hoverColor="white"
                />
            </Swiper>
        </div>
    );
}
