import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { NoData } from '@/components/ui/NoData';
import { SearchIcon } from '@/components/icons';
import { ProductItem } from '@/components/ui/product/ProductItem';

import { PRODUCT_MOCK_DATA } from '@/constants/product';

import type { Route } from './+types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * meta 함수 - 검색 페이지 메타데이터 설정
 */
export function meta() {
    return [
        {
            title: '검색 결과 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '상품 검색 결과를 확인하세요',
        },
        {
            name: 'keywords',
            content: '검색, 상품검색, 쇼핑몰',
        },
    ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';

    // 여기서 실제로는 검색 API를 호출하거나 데이터를 필터링할 수 있습니다
    // 현재는 디버그용

    const results = PRODUCT_MOCK_DATA.filter((product) => product.name.includes(keyword));

    return {
        keyword: keyword,
        data: results,
    };
}

// 페이지네이션을 위한 데이터 분할
/**
 * Search 컴포넌트 - 검색 결과 페이지
 */
export default function Search({ loaderData }: Route.ComponentProps) {
    const { keyword, data } = loaderData;

    useGSAP(() => {
        gsap.to('.searchContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    useGSAP(() => {
        const productItems = gsap.utils.toArray('.searchResults .productItem') as Element[];

        if (productItems.length === 0) return;

        ScrollTrigger.batch(productItems, {
            start: 'top 95%',
            once: true,
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'power2.out',
                }),
        });
    }, [loaderData]);

    return (
        <div className="searchContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-10">
                <h2 className="font-serif text-3xl leading-heading mb-6">{keyword ? `"${keyword}" 검색 결과` : '검색 결과'}</h2>
                <div className="mb-5">
                    <p className="text-xs md:text-sm text-black/60">총 {data.length}개의 상품이 검색되었습니다.</p>
                </div>

                {/* 검색 결과 영역 */}
                <div className="searchResults w-full">
                    {data.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-10 md:gap-y-15">
                            {data.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    discountRate={product.discountRate}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    starRating={product.starRating}
                                    reviewCount={product.reviewCount}
                                    thumbnailUrl={product.thumbnailUrl}
                                    badges={product.badges}
                                    isFadeAnimation
                                />
                            ))}
                        </div>
                    ) : (
                        <NoData
                            icon={<SearchIcon tailwind="w-full h-full" />}
                            title="검색 결과가 없습니다"
                            description={`"${keyword}"에 대한 검색 결과를 찾을 수 없습니다.
                                    다른 키워드로 검색해보세요.`}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}
