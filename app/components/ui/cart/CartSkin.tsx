import React from 'react';

// 스타일 import
import './cart-skin-scoped.css';

// Base64 이미지 import
import { CART_PRODUCT_IMAGES } from './cart-images';

// Mock 데이터 (번들에 포함)
const CART_DATA = {
    totalCount: 3,
    items: [
        {
            id: 1,
            name: '레고트 누프레임 커플잔 2P',
            price: 32000,
            originalPrice: 40000,
            discount: 20,
            quantity: 2,
            imageUrl: CART_PRODUCT_IMAGES.product1,
            productUrl: '/products/1'
        },
        {
            id: 2,
            name: '모던 스톤웨어 접시 세트',
            price: 25500,
            originalPrice: 30000,
            discount: 15,
            quantity: 1,
            imageUrl: CART_PRODUCT_IMAGES.product2,
            productUrl: '/products/2'
        },
        {
            id: 3,
            name: '에코 우드 컵 4P 세트',
            price: 18000,
            originalPrice: 20000,
            discount: 10,
            quantity: 1,
            imageUrl: CART_PRODUCT_IMAGES.product3,
            productUrl: '/products/3'
        }
    ],
    totalProductPrice: 130000,
    totalDiscountPrice: 22500,
    shippingFee: 3000,
    totalPaymentPrice: 110500
};

/**
 * CartSkin 컴포넌트 - 장바구니 UMD 버전
 *
 * 기능:
 * - 장바구니 상품 목록 표시
 * - 수량 조절 (UI만)
 * - 전체 선택/개별 선택 (UI만)
 * - 주문 정보 요약
 * - 완전히 독립적인 컴포넌트 (props 없음)
 */
export function Cart() {
    const [selectedItems, setSelectedItems] = React.useState<number[]>(CART_DATA.items.map(item => item.id));
    const [quantities, setQuantities] = React.useState<{[key: number]: number}>(
        CART_DATA.items.reduce((acc, item) => ({...acc, [item.id]: item.quantity}), {})
    );

    const isAllSelected = selectedItems.length === CART_DATA.items.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(CART_DATA.items.map(item => item.id));
        }
    };

    const handleSelectItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleQuantityChange = (id: number, change: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, prev[id] + change)
        }));
    };

    return (
        <div className="cart-skin-cartContainer">
            {/* 헤더 섹션 */}
            <section className="cart-skin-globalWrapper cart-skin-w-full cart-skin-pt-8 cart-skin-md-py-10 cart-skin-flex cart-skin-flex-col cart-skin-md-flex-row cart-skin-gap-10 cart-skin-items-center cart-skin-justify-between cart-skin-mb-5 cart-skin-md-mb-10">
                <div className="cart-skin-flex cart-skin-items-center cart-skin-gap-3 cart-skin-font-serif">
                    <h2 className="cart-skin-text-3xl">장바구니</h2>
                    <p className="cart-skin-text-primary cart-skin-text-4xl">{CART_DATA.totalCount}</p>
                </div>
                <div className="cart-skin-flex cart-skin-items-center cart-skin-gap-3">
                    <p className="cart-skin-text-primary cart-skin-font-bold">장바구니</p>
                    <span>
                        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="cart-skin-hover-primary cart-skin-w-16 cart-skin-h-16 cart-skin-text-black-40 cart-skin-hover-black-40" style={{ transform: 'rotate(90deg)' }}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
                        </svg>
                    </span>
                    <p className="cart-skin-text-black-40">주문서 작성</p>
                    <span>
                        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="cart-skin-hover-primary cart-skin-w-16 cart-skin-h-16 cart-skin-text-black-40 cart-skin-hover-black-40" style={{ transform: 'rotate(90deg)' }}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
                        </svg>
                    </span>
                    <p className="cart-skin-text-black-40">주문 완료</p>
                </div>
            </section>

            {/* 메인 섹션 */}
            <section className="cart-skin-globalWrapper cart-skin-mb-20 cart-skin-relative cart-skin-flex cart-skin-flex-col cart-skin-md-flex-row cart-skin-items-start cart-skin-justify-between cart-skin-gap-5">
                {/* 상품 목록 */}
                <div className="cart-skin-flex-1 cart-skin-w-full cart-skin-border-t cart-skin-border-black">
                    <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between cart-skin-py-4 cart-skin-gap-4">
                        <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between cart-skin-w-full cart-skin-gap-x-2">
                            <label className="cart-skin-flex cart-skin-items-center cart-skin-cursor-pointer">
                                <input 
                                    id="itemSelectAll" 
                                    className="cart-skin-peer cart-skin-sr-only" 
                                    type="checkbox" 
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                                <span className={`cart-skin-flex cart-skin-items-center cart-skin-justify-center cart-skin-w-20 cart-skin-h-20 cart-skin-border cart-skin-border-black-20 cart-skin-text-black-20 cart-skin-hover-border-primary cart-skin-transition-colors cart-skin-duration-300 ${isAllSelected ? 'cart-skin-bg-primary cart-skin-text-white' : ''}`}>
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-skin-hover-primary cart-skin-w-18 cart-skin-h-18">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <span className="cart-skin-text-sm cart-skin-ml-2">전체 선택 ({selectedItems.length}/{CART_DATA.items.length})</span>
                            </label>
                        </div>
                        <button type="button" aria-label="선택 삭제" className="cart-skin-text-sm cart-skin-underline cart-skin-hover-black-80 cart-skin-shrink-0">
                            선택 삭제
                        </button>
                    </div>

                    <div className="cart-skin-border-t cart-skin-border-black-10">
                        <ul>
                            {CART_DATA.items.map((item) => {
                                const isSelected = selectedItems.includes(item.id);
                                const quantity = quantities[item.id];
                                const totalPrice = item.price * quantity;

                                return (
                                    <li key={item.id} className="cart-skin-flex cart-skin-gap-4 cart-skin-py-5 cart-skin-border-b cart-skin-border-black-10">
                                        <div className="cart-skin-shrink-0">
                                            <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between cart-skin-w-full cart-skin-gap-x-2">
                                                <label className="cart-skin-flex cart-skin-items-center cart-skin-cursor-pointer">
                                                    <input 
                                                        id={`item-${item.id}`}
                                                        className="cart-skin-peer cart-skin-sr-only" 
                                                        type="checkbox" 
                                                        checked={isSelected}
                                                        onChange={() => handleSelectItem(item.id)}
                                                    />
                                                    <span className={`cart-skin-flex cart-skin-items-center cart-skin-justify-center cart-skin-w-20 cart-skin-h-20 cart-skin-border cart-skin-border-black-20 cart-skin-text-black-20 cart-skin-hover-border-primary cart-skin-transition-colors cart-skin-duration-300 ${isSelected ? 'cart-skin-bg-primary cart-skin-text-white' : ''}`}>
                                                        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-skin-hover-primary cart-skin-w-18 cart-skin-h-18">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                                        </svg>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="cart-skin-w-75 cart-skin-md-w-120 cart-skin-h-75 cart-skin-md-h-120 cart-skin-aspect-square cart-skin-shrink-0">
                                            <a href={item.productUrl} data-discover="true">
                                                <img alt={item.name} className="cart-skin-w-full cart-skin-h-full cart-skin-object-cover" src={item.imageUrl} />
                                            </a>
                                        </div>
                                        <div className="cart-skin-flex-1 cart-skin-flex cart-skin-flex-col cart-skin-justify-between cart-skin-gap-2 cart-skin-md-gap-4">
                                            <div className="cart-skin-flex cart-skin-items-start cart-skin-justify-between">
                                                <div>
                                                    <h3 className="cart-skin-text-sm cart-skin-font-bold cart-skin-mb-2 cart-skin-line-clamp-1 cart-skin-md-line-clamp-2">{item.name}</h3>
                                                    <div className="cart-skin-flex cart-skin-flex-wrap cart-skin-items-center cart-skin-gap-1-5">
                                                        <em className="cart-skin-text-xs cart-skin-text-primary cart-skin-font-bold cart-skin-bg-primary-10 cart-skin-px-1 cart-skin-py-0-5 cart-skin-rounded">{item.discount}%</em>
                                                        <p className="cart-skin-font-bold">{item.price.toLocaleString()}원</p>
                                                        <del className="cart-skin-text-sm cart-skin-font-bold cart-skin-text-black-40 cart-skin-w-full cart-skin-md-w-auto cart-skin-mt-neg-0-5 cart-skin-md-mt-0">{item.originalPrice.toLocaleString()}원</del>
                                                    </div>
                                                </div>
                                                <button type="button" aria-label="상품 삭제" className="cart-skin-p-2">
                                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-skin-hover-primary">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 8.939 6.11 5.05a.75.75 0 0 0-1.06 1.06L8.938 10 5.05 13.889a.75.75 0 0 0 1.06 1.06l8.84-8.838a.75.75 0 0 0-1.061-1.061L9.999 8.939Zm3.888 6.014-3.889-3.89 1.06-1.06 3.89 3.889a.75.75 0 0 1-1.061 1.06Z" fill="currentColor"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                                                <div className="cart-skin-quantity-container">
                                                    <button 
                                                        className="cart-skin-quantity-button" 
                                                        type="button"
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                    >
                                                        <svg width="20px" height="20px" viewBox="0 0 21 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="cart-skin-w-12 cart-skin-h-12 cart-skin-text-black">
                                                            <rect x="2.25" y="10.75" width="1.5" height="16" rx="0.75" transform="rotate(-90 2.25 10.75)" fill="currentColor"></rect>
                                                        </svg>
                                                    </button>
                                                    <input readOnly className="cart-skin-quantity-input" value={quantity} />
                                                    <button 
                                                        className="cart-skin-quantity-button" 
                                                        type="button"
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                    >
                                                        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-skin-w-12 cart-skin-h-12">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.238 2.75c.394 0 .714.336.714.75v5.75h5.476c.395 0 .714.336.714.75s-.32.75-.714.75h-5.476v5.75c0 .414-.32.75-.714.75-.395 0-.715-.336-.715-.75v-5.75H4.047c-.394 0-.714-.336-.714-.75s.32-.75.714-.75h5.476V3.5c0-.414.32-.75.715-.75Z" fill="currentColor"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="cart-skin-font-bold">{totalPrice.toLocaleString()}원</p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-center cart-skin-p-4 cart-skin-bg-black-3 cart-skin-font-bold cart-skin-gap-1 cart-skin-text-xs">
                            <p>상품 금액 : {CART_DATA.totalProductPrice.toLocaleString()}원</p>
                            <p>/</p>
                            <p>배송비 : {CART_DATA.shippingFee.toLocaleString()}원</p>
                            <div className="cart-skin-relative">
                                <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-skin-hover-primary cart-skin-w-4 cart-skin-h-4">
                                    <g clipPath="url(#icon-info-svg)" fill="currentColor">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.5 10a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" fill="currentColor"></path>
                                        <path d="M9.106 11.52v.097h1.262v-.097c.01-.808.27-1.18.895-1.563.7-.415 1.137-.987 1.143-1.865C12.4 6.809 11.403 6 9.947 6c-1.331 0-2.41.739-2.447 2.189h1.348c.037-.723.555-1.068 1.089-1.068.587 0 1.062.388 1.056.992.006.54-.35.9-.808 1.197-.68.415-1.068.836-1.079 2.21Zm-.172 1.639a.839.839 0 0 0 .84.841c.448 0 .831-.377.831-.841a.845.845 0 0 0-.83-.83c-.464.005-.846.377-.841.83Z" fill="currentColor"></path>
                                    </g>
                                    <defs fill="currentColor">
                                        <clipPath id="icon-info-svg" fill="currentColor">
                                            <path transform="translate(2 2)" d="M0 0h16v16H0z" fill="currentColor"></path>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 주문 정보 요약 */}
                <div className="cart-skin-w-full cart-skin-md-w-360 cart-skin-md-shrink-0 cart-skin-md-sticky cart-skin-md-top-60">
                    <div className="cart-skin-cartSummary cart-skin-bg-black-3 cart-skin-p-5 cart-skin-border cart-skin-border-black-10">
                        <h3 className="cart-skin-font-bold cart-skin-text-lg cart-skin-mb-4">주문 정보</h3>
                        <div className="cart-skin-space-y-3">
                            <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                                <span className="cart-skin-text-sm">총 상품 금액</span>
                                <span className="cart-skin-text-sm">{CART_DATA.totalProductPrice.toLocaleString()}원</span>
                            </div>
                            <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                                <span className="cart-skin-text-sm">총 할인 금액</span>
                                <span className="cart-skin-text-sm cart-skin-text-error">-{CART_DATA.totalDiscountPrice.toLocaleString()}원</span>
                            </div>
                            <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                                <span className="cart-skin-text-sm">배송비</span>
                                <span className="cart-skin-text-sm">{CART_DATA.shippingFee.toLocaleString()}원</span>
                            </div>
                            <div className="cart-skin-totalPrice cart-skin-border-t cart-skin-border-black-10 cart-skin-pt-3">
                                <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                                    <span className="cart-skin-font-bold">총 결제 금액</span>
                                    <span className="cart-skin-font-bold cart-skin-text-lg cart-skin-text-primary">{CART_DATA.totalPaymentPrice.toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                        <div className="cart-skin-mt-5">
                            <button type="button" className="cart-skin-flex cart-skin-items-center cart-skin-justify-center cart-skin-border cart-skin-hover-bg-primary-90 cart-skin-transition-colors cart-skin-bg-primary cart-skin-text-white cart-skin-border-primary cart-skin-hover-bg-primary-80 cart-skin-w-full cart-skin-px-4-5 cart-skin-py-3-5">
                                주문하기
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(Cart as any).SAMPLE_DATA = CART_DATA;

export default Cart;