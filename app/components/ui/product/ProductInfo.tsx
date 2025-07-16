/**
 * ProductInfo 컴포넌트 - 상품 상세 정보 표시
 * @param product - 상품 데이터 객체
 * @param onReviewScrollTo - 리뷰 섹션 스크롤 함수
 * @param onBuyNow - 바로구매 버튼 클릭 핸들러
 */
import { useState } from 'react';

import { ReviewScore } from '@/components/ui/product/ReviewScore';
import { ProductPrice } from '@/components/ui/product/ProductPrice';
import { InfoButton } from '@/components/ui/button/InfoButton';
import { Steppers } from '@/components/ui/Steppers';
import { ColorButton } from '@/components/ui/button/ColorButton';
import { CartButton } from '@/components/ui/button/CartButton';

import type { ProductInfoProps } from '@/types/product';
export function ProductInfo({ product, onReviewScrollTo, onBuyNow }: ProductInfoProps) {
    const [selectedItemCount, setSelectedItemCount] = useState<number>(0);

    return (
        <section className="productInfoContainer globalWrapper w-full py-5 md:py-15">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-7 md:gap-[60px]">
                <div className="aspect-square h-full w-full md:max-w-[46%]">
                    <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="h-full w-full px-5 md:px-10">
                    <h2 className="font-serif text-2xl">{product.name}</h2>
                    <div className="border-b border-black/10 py-4">
                        <ReviewScore
                            starRating={product.starRating}
                            reviewCount={product.reviewCount}
                            onCountClick={onReviewScrollTo}
                        />
                        <div className="flex items-center gap-1.5 mt-3">
                            <ProductPrice
                                discountRate={product.discountRate}
                                price={product.price}
                                originalPrice={product.originalPrice}
                            />
                            <InfoButton>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm mb-2">할인가 안내</h4>
                                    <div className="text-xs text-black/60">
                                        <p>• 상품 할인: 20% (-8,000원)</p>
                                    </div>
                                </div>
                            </InfoButton>
                        </div>
                    </div>
                    <div className="border-b border-black/10 py-4">
                        <div className="flex items-start gap-3">
                            <p className="text-sm w-[84px] shrink-0">배송비</p>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1 text-sm">
                                    <p>택배</p>
                                    <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                                    <p className="text-primary">3,000원</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <p>제주 및 도서 산간 배송비 추가</p>
                                    <InfoButton>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-sm mb-2">배송비 안내</h4>
                                            <div className="space-y-1 text-xs text-black/60">
                                                <p>• 국내 일반 지역: 3,000원</p>
                                                <p>• 제주 지역: 6,000원</p>
                                                <p>• 제주외 도서산간 지역: 6,000원</p>
                                            </div>
                                        </div>
                                    </InfoButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-black/10 py-4">
                        <div className="p-5 bg-black/3">
                            <p className="text-sm">{product.name}</p>
                            <div className="flex items-center justify-between mt-4">
                                <Steppers
                                    count={selectedItemCount}
                                    setCount={setSelectedItemCount}
                                />
                                <p className="text-sm">{product.price.toLocaleString()}원</p>
                            </div>
                        </div>
                    </div>
                    <div className="py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm">총 상품 금액 {selectedItemCount}개</p>
                            <p className="font-bold">{(product.price * selectedItemCount).toLocaleString()}원</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between gap-4">
                            <CartButton
                                colorType="white"
                                tailwind="w-full p-3 md:p-5 text-sm md:text-base"
                            >
                                장바구니
                            </CartButton>
                            <ColorButton
                                colorType="primary"
                                onClick={onBuyNow}
                                ariaLabel="바로구매"
                                type="button"
                                tailwind="w-full p-3 md:p-5 text-sm md:text-base"
                                to="/order"
                            >
                                바로구매
                            </ColorButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
