import { Link } from 'react-router';

import { CloseIcon } from '@/components/icons';
import { CheckLabelBox } from '@/components/ui/input/CheckLabelBox';
import { ProductPrice } from '@/components/ui/product/ProductPrice';
import { Steppers } from '@/components/ui/Steppers';

import type { CartItemProps } from '@/types/cart';

/**
 * CartItem 컴포넌트 - 장바구니 개별 상품 아이템
 *
 * 기능:
 * - 상품 정보 표시 (이미지, 이름, 가격)
 * - 선택/해제 체크박스
 * - 수량 조절
 * - 상품 삭제
 * - 개별 상품 총 가격 표시
 */
export function CartItem({ item, isSelected, onSelect, onQuantityChange, onDelete }: CartItemProps) {
    return (
        <li className="flex gap-4 py-5 border-b border-black/10">
            <div className="shrink-0">
                <CheckLabelBox
                    id={item.id.toString()}
                    checked={isSelected}
                    onChange={(checked) => onSelect(item.id, checked)}
                />
            </div>
            <div className="w-[75px] md:w-[120px] h-[75px] md:h-[120px] aspect-square shrink-0">
                <Link to={`/products/${item.id}`}>
                    <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between gap-2 md:gap-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-bold mb-2 line-clamp-1 md:line-clamp-2">{item.name}</h3>
                        <ProductPrice
                            price={item.price}
                            discountRate={item.discountRate}
                            originalPrice={item.originalPrice}
                            lineBreak={true}
                        />
                    </div>
                    <button
                        type="button"
                        aria-label="상품 삭제"
                        className="p-2"
                        onClick={() => onDelete(item.id)}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <Steppers
                        count={item.quantity}
                        setCount={(newQuantity) => onQuantityChange(item.id, newQuantity)}
                    />
                    <p className="font-bold">{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
            </div>
        </li>
    );
}
