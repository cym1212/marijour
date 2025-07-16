import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BreadcrumbTabsHeader } from '@/components/ui/nav/BreadcrumbTabsHeader';
import { ProductItem } from '@/components/ui/product/ProductItem';
import { NoData } from '@/components/ui/NoData';
import { ProductIcon } from '@/components/icons';

import { GNB_MOCK_DATA } from '@/constants/navigation';
import { PRODUCT_MOCK_DATA } from '@/constants/product';

import type { Route } from './+types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function meta() {
    return [
        {
            title: '상품 - Marijour',
        },
        {
            name: 'description',
            content: 'Marijour의 다양한 상품을 만나보세요. 키친&다이닝, 바디케어, 침실&패브릭까지 모든 생활용품을 한곳에서',
        },
        {
            name: 'keywords',
            content: '상품, 쇼핑, 마리쥬르, 키친, 다이닝, 바디케어, 침실, 패브릭, 생활용품',
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    // 현재는 GNB_MOCK_DATA를 반환하지만, 실제로는 API 호출 등을 통해 데이터를 가져올 수 있습니다.
    return PRODUCT_MOCK_DATA;
}

/**
 * Shop 페이지 - 상품 목록
 * 카테고리별 상품 표시 및 브레드크럼 네비게이션 포함
 */

export default function Shop({ loaderData }: Route.ComponentProps) {
    useGSAP(() => {
        gsap.to('.shopContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    useGSAP(() => {
        const productItems = gsap.utils.toArray('.productsContainer .productItem') as Element[];

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
        <div className="shopContainer opacity-0">
            <section className="globalWrapper w-full py-7.5 md:py-10">
                <BreadcrumbTabsHeader
                    navData={GNB_MOCK_DATA}
                    mainPath="/shop"
                />
            </section>

            {loaderData.length > 0 ? (
                <>
                    <section className="globalWrapper w-full pb-2">
                        <div className="mt-1">
                            <p className="text-xs md:text-sm text-black/60">TOTAL {loaderData.length} ITEMS</p>
                        </div>
                    </section>
                    <section className="productsContainer globalWrapper w-full pb-5 md:pb-10 mb-5 md:mb-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-10 md:gap-y-15">
                            {loaderData.map((product) => (
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
                    </section>
                </>
            ) : (
                <section className="globalWrapper w-full">
                    <NoData
                        icon={<ProductIcon tailwind="w-full h-full" />}
                        title="등록된 상품이 없습니다"
                        description="이 카테고리에는 아직 상품이 등록되지 않았습니다.
                        곧 새로운 상품들을 만나보실 수 있습니다."
                    />
                </section>
            )}
        </div>
    );
}
