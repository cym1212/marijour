import React, { useEffect, useRef } from 'react';
import { ProductItem } from './ProductItem';
import type { ProductItemProps } from '@/types/product';

interface ProductItemWrapperProps extends ProductItemProps {
    onProductClick?: (product: ProductItemProps) => void;
    onAddToCart?: (product: ProductItemProps) => void;
    showPrice?: boolean;
    showAddToCart?: boolean;
}

export function ProductItemWrapper({
    onProductClick,
    onAddToCart,
    showPrice = true,
    showAddToCart = true,
    ...productProps
}: ProductItemWrapperProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        // 상품 클릭 이벤트 가로채기 (div 클릭 포함)
        const handleProductClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            const productDiv = target.closest('.productItem');
            const cartButton = target.closest('button');
            
            // 장바구니 버튼 클릭이 아닌 경우에만 상품 클릭 처리
            if (!cartButton && (link || productDiv) && onProductClick) {
                if (link) e.preventDefault();
                onProductClick(productProps);
            }
        };

        // 장바구니 버튼 클릭 이벤트 가로채기
        const handleCartClick = (e: MouseEvent) => {
            const button = (e.target as HTMLElement).closest('button');
            if (button && button.closest('.absolute') && onAddToCart) {
                e.stopPropagation();
                e.preventDefault();
                onAddToCart(productProps);
            }
        };

        wrapperRef.current.addEventListener('click', handleProductClick);
        wrapperRef.current.addEventListener('click', handleCartClick, true);

        return () => {
            if (wrapperRef.current) {
                wrapperRef.current.removeEventListener('click', handleProductClick);
                wrapperRef.current.removeEventListener('click', handleCartClick, true);
            }
        };
    }, [onProductClick, onAddToCart, productProps]);

    return (
        <div ref={wrapperRef}>
            <ProductItem {...productProps} />
            {/* 조건부 표시를 위한 인라인 스타일 */}
            {(!showAddToCart || !showPrice) && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                        ${!showAddToCart ? `.productItem .absolute { display: none !important; }` : ''}
                        ${!showPrice ? `.productItem .space-y-0\\.5, .productItem .space-y-1 { display: none !important; }` : ''}
                    `
                }} />
            )}
        </div>
    );
}