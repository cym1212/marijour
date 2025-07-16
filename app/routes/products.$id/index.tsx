import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ProductInfo } from '@/components/ui/product/ProductInfo';
import { ProductPurchaseBar } from '@/components/ui/product/ProductPurchaseBar';
import { ReviewList } from '@/components/ui/review/ReviewList';
import { NoData } from '@/components/ui/NoData';
import { StarIcon, ProductIcon } from '@/components/icons';

import { PRODUCT_MOCK_DATA } from '@/constants/product';
import { REVIEW_MOCK_DATA } from '@/constants/review';

import type { Route } from './+types';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

export function meta() {
    return [
        {
            title: '상품 상세 - Marijour',
        },
        {
            name: 'description',
            content: '상품의 상세 정보, 가격, 리뷰를 확인하고 바로 구매하거나 장바구니에 담을 수 있습니다',
        },
        {
            name: 'keywords',
            content: '상품상세, 마리쥬르, 구매, 리뷰, 가격, 배송, 장바구니',
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    // params는 URL 경로에서 동적 세그먼트를 추출하는 데 사용됩니다.
    // products.$id 폴더는 products/[동적경로]로 매핑되며 $뒤에 오는 값은 params로 전달됩니다. (id는 다른 값으로 변경 가능)
    // 예: /products/123 -> params.id는 '123'이 됩니다.
    const { id } = params;

    if (!id) {
        return {
            product: null,
            reviews: [],
        };
    }

    const productData = PRODUCT_MOCK_DATA.find((item) => item.id === Number(id));
    const reviewData = REVIEW_MOCK_DATA.filter((review) => review.productId === Number(id));

    return {
        product: productData || null,
        reviews: reviewData || [],
    };
}

/**
 * ProductDetail 페이지 - 상품 상세 정보
 * 상품 정보, 리뷰, 구매 기능을 포함한 상품 상세 페이지
 */
export default function ProductDetail({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const { product, reviews } = loaderData;

    // 리뷰 섹션으로 스크롤하는 함수
    const handleReviewScrollTo = () => {
        gsap.to(window, {
            scrollTo: {
                y: '.productReviewContainer',
                offsetY: 100,
            },
            duration: 0.9,
        });
    };

    // 구매 버튼 함수
    const handleBuyNow = () => {
        // 구매 버튼 클릭 시 로직 처리
        navigate('/order');
    };

    useGSAP(() => {
        gsap.to('.productContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    useGSAP(() => {
        const productInfoContainer = document.querySelector('.productInfoContainer');
        const purchaseContainer = document.querySelector('.productPurchaseBar');

        if (!productInfoContainer || !purchaseContainer) return;

        ScrollTrigger.create({
            trigger: productInfoContainer,
            start: 'bottom 5%',
            onEnter: () =>
                gsap.to(purchaseContainer, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.9,
                    ease: 'power2.out',
                }),
            onEnterBack: () =>
                gsap.to(purchaseContainer, {
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.set(purchaseContainer, {
                            visibility: 'hidden',
                        });
                    },
                }),
        });
    }, []);

    return (
        <>
            <div className="productContainer opacity-0">
                {product ? (
                    <>
                        {/* 상품 정보 */}
                        <ProductInfo
                            product={product}
                            onReviewScrollTo={handleReviewScrollTo}
                            onBuyNow={handleBuyNow}
                        />

                        {/* 상품 상세 정보 (이미지 등) */}
                        <section className="productDetailContainer globalWrapper w-full py-5 md:py-10">
                            <div className="border-y border-black/20 py-8 md:py-10">
                                <img
                                    // 실제 이미지 경로로 변경 필요
                                    src="/images/product-detail.png"
                                    alt="상품 상세 이미지"
                                    className="mx-auto"
                                />
                            </div>
                        </section>

                        {/* 리뷰 */}
                        <section className="productReviewContainer globalWrapper w-full py-8 md:py-10">
                            <div className="flex items-center gap-3 md:gap-4 font-serif text-2xl mb-3">
                                <h2>리뷰 ({reviews.length})</h2>
                                <div className="flex items-center gap-1">
                                    <StarIcon tailwind="w-[24px] md:w-[27px] h-[24px] md:h-[27px] text-black hover-black" />
                                    <p className="-md-0.5 md:-mt-1">{product.starRating}</p>
                                </div>
                            </div>
                            <ReviewList
                                data={reviews}
                                isVisibleProductInfo={true}
                            />
                        </section>
                    </>
                ) : (
                    <NoData
                        icon={<ProductIcon tailwind="w-full h-full" />}
                        title="상품을 찾을 수 없습니다"
                        description="요청하신 상품이 존재하지 않거나 삭제되었습니다.
                        다른 상품을 둘러보세요."
                    />
                )}
            </div>

            {/* 하단 구매 메뉴*/}
            {product && (
                <ProductPurchaseBar
                    product={product}
                    onBuyNow={handleBuyNow}
                />
            )}
        </>
    );
}
