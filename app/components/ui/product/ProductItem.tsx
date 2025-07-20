// import { Link } from 'react-router'; // 웹빌더 환경 호환성을 위해 제거

import { CartIcon } from '@/components/icons';
import { ReviewScore } from '@/components/ui/product/ReviewScore';
import { ProductPrice } from '@/components/ui/product/ProductPrice';
import { CartButton } from '@/components/ui/button/CartButton';
import { TextBadge } from '@/components/ui/Badge';

import type { ProductItemProps } from '@/types/product';

export function ProductItem({ id, name, discountRate, price, originalPrice, starRating, reviewCount, thumbnailUrl, badges, isFadeAnimation }: ProductItemProps) {
    const handleProductClick = () => {
        // 웹빌더 환경에서는 별도의 클릭 핸들러로 처리
        console.log('Product clicked:', id);
        // 추후 외부에서 전달받은 클릭 핸들러 호출 가능
    };

    return (
        <>
            <div className={`productItem group/productItem cursor-pointer ${isFadeAnimation ? 'opacity-0' : ''}`}>
                <div
                    onClick={handleProductClick}
                    className="block"
                >
                    {/* 썸네일 */}
                    <div className="relative overflow-hidden aspect-square">
                        <img
                            src={thumbnailUrl}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/productItem:scale-105"
                        />
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4">
                            <CartButton
                                colorType="primary"
                                tailwind="p-2.5"
                            >
                                <CartIcon tailwind="hover-white" />
                            </CartButton>
                        </div>
                    </div>
                    {/* 제품 정보 */}
                    <div className="mt-3 md:mt-4">
                        <h4 className="text-sm text-gray-900 line-clamp-2">{name}</h4>
                        <div className="mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                            <ProductPrice
                                discountRate={discountRate}
                                price={price}
                                originalPrice={originalPrice}
                            />
                            {reviewCount > 0 && (
                                <ReviewScore
                                    starRating={starRating}
                                    reviewCount={reviewCount}
                                />
                            )}
                        </div>
                        {badges && (
                            <div className="flex flex-wrap items-center justify-start gap-1.5 mt-2 mt:mb-3">
                                {badges.map((badge, index) => (
                                    <TextBadge
                                        text={badge}
                                        key={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
