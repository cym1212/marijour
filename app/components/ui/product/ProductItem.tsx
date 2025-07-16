import { Link } from 'react-router';

import { CartIcon } from '@/components/icons';
import { ReviewScore } from '@/components/ui/product/ReviewScore';
import { ProductPrice } from '@/components/ui/product/ProductPrice';
import { CartButton } from '@/components/ui/button/CartButton';
import { TextBadge } from '@/components/ui/Badge';

import type { ProductItemProps } from '@/types/product';

export function ProductItem({ id, name, discountRate, price, originalPrice, starRating, reviewCount, thumbnailUrl, badges, isFadeAnimation }: ProductItemProps) {
    return (
        <>
            <div className={`productItem group/productItem cursor-pointer ${isFadeAnimation ? 'opacity-0' : ''}`}>
                <Link
                    to={`/products/${id}`}
                    className="block"
                >
                    {/* 썸네일 */}
                    <div className="relative overflow-hidden">
                        <div className="w-full h-full aspect-square">
                            <img
                                src={thumbnailUrl}
                                alt={name}
                                className="w-full h-full object-cover transition-transform duration-300 east-out group-hover/productItem:scale-105"
                            />
                        </div>
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
                </Link>
            </div>
        </>
    );
}
