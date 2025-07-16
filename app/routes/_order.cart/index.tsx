import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { CartItem, CartSummary, CartHeader, EmptyCart, CartPurchaseBar } from '@/components/ui/cart';
import { InfoButton } from '@/components/ui/button';

import { CART_MOCK_DATA } from '@/constants/cart';

import type { Route } from './+types';
import type { CartItem as CartItemType } from '@/types/cart';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

export function meta() {
    return [
        {
            title: '장바구니 - Marijour',
        },
        {
            name: 'description',
            content: '장바구니에 담은 상품을 확인하고 주문을 진행하세요',
        },
        {
            name: 'keywords',
            content: '장바구니, 주문, 결제, 쇼핑, 마리쥬르',
        },
    ];
}

export async function clientLoader({ request, params }: Route.LoaderArgs) {
    return {
        data: CART_MOCK_DATA,
    };
}

const DELIVERY_FEE = 3000;

/**
 * Cart 페이지 - 장바구니
 * 장바구니 상품 관리 및 주문 진행 기능
 */
export default function Cart({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const { data } = loaderData;

    // 장바구니 아이템 상태 관리
    const [cartItems, setCartItems] = useState<CartItemType[]>(data);

    // 선택된 아이템 ID들 관리
    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set(data.map((item) => item.id)));

    // 전체 선택 여부 계산
    const isAllSelected = useMemo(() => {
        return cartItems.length > 0 && selectedItemIds.size === cartItems.length;
    }, [cartItems.length, selectedItemIds.size]);

    // 선택된 아이템들의 총 가격 계산
    const totalPrice = useMemo(() => {
        return cartItems.filter((item) => selectedItemIds.has(item.id)).reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems, selectedItemIds]);

    // 선택된 아이템들의 총 원가 계산
    const totalOriginalPrice = useMemo(() => {
        return cartItems.filter((item) => selectedItemIds.has(item.id)).reduce((total, item) => total + item.originalPrice * item.quantity, 0);
    }, [cartItems, selectedItemIds]);

    // 선택된 아이템들의 총 할인 금액 계산
    const totalDiscountAmount = useMemo(() => {
        return totalOriginalPrice - totalPrice;
    }, [totalOriginalPrice, totalPrice]);

    // 개별 아이템 선택/해제
    const handleItemSelect = (itemId: number, checked: boolean) => {
        setSelectedItemIds((prev) => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(itemId);
            } else {
                newSet.delete(itemId);
            }
            return newSet;
        });
    };

    // 전체 선택/해제
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItemIds(new Set(cartItems.map((item) => item.id)));
        } else {
            setSelectedItemIds(new Set());
        }
    };

    // 수량 변경
    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) return;

        setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
    };

    // 개별 상품 삭제
    const handleDeleteItem = (itemId: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        setSelectedItemIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });
    };

    // 선택된 상품들 삭제
    const handleDeleteSelected = () => {
        setCartItems((prev) => prev.filter((item) => !selectedItemIds.has(item.id)));
        setSelectedItemIds(new Set());
    };

    // 구매 버튼 함수
    const handleOrder = () => {
        // 구매 버튼 클릭 시 로직 처리
        navigate('/order');
    };

    useGSAP(() => {
        gsap.to('.cartContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    useGSAP(() => {
        const cartSummary = document.querySelector('.cartSummary');
        const cartTotalPrice = cartSummary?.querySelector('.totalPrice');
        const cartPurchaseBar = document.querySelector('.cartPurchaseBar');

        if (!cartSummary || !cartTotalPrice || !cartPurchaseBar) return;

        let trigger: ScrollTrigger | null = null;

        const createScrollTrigger = () => {
            // 모바일에서만 ScrollTrigger 생성 (768px 미만)
            if (window.innerWidth < 768) {
                trigger = ScrollTrigger.create({
                    trigger: cartSummary,
                    start: 'bottom bottom',
                    end: 'bottom bottom',
                    refreshPriority: -1,
                    onRefresh: (self) => {
                        const totalPriceRectTop = cartTotalPrice.getBoundingClientRect().top;
                        const purchaseBarRectTop = cartPurchaseBar.getBoundingClientRect().top;

                        // 총 가격 영역이 구매 바 영역 위에 있을 때만 구매 바 표시
                        if (totalPriceRectTop < purchaseBarRectTop) {
                            gsap.set(cartPurchaseBar, {
                                opacity: 0,
                                visibility: 'hidden',
                            });
                        } else {
                            gsap.to(cartPurchaseBar, {
                                opacity: 1,
                                visibility: 'visible',
                                duration: 0,
                                ease: 'power2.out',
                            });
                        }
                    },
                    onEnter: () =>
                        gsap.to(cartPurchaseBar, {
                            opacity: 0,
                            duration: 0,
                            ease: 'power2.out',
                            onComplete: () => {
                                gsap.set(cartPurchaseBar, {
                                    visibility: 'hidden',
                                });
                            },
                        }),
                    onEnterBack: () =>
                        gsap.to(cartPurchaseBar, {
                            opacity: 1,
                            visibility: 'visible',
                            duration: 0,
                            ease: 'power2.out',
                        }),
                });
            } else {
                // 데스크톱에서는 CartPurchaseBar 완전히 숨김
                gsap.set(cartPurchaseBar, {
                    opacity: 0,
                    visibility: 'hidden',
                });
            }
        };

        const handleResize = () => {
            // 기존 trigger 제거
            if (trigger) {
                trigger.kill();
                trigger = null;
            }
            // 새로운 trigger 생성
            createScrollTrigger();
            ScrollTrigger.refresh();
        };

        // 초기 ScrollTrigger 생성
        createScrollTrigger();
        ScrollTrigger.refresh();

        // 리사이즈 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);

        return () => {
            if (trigger) {
                trigger.kill();
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="cartContainer opacity-0">
                <section className="globalWrapper w-full pt-8 md:py-10 flex flex-col md:flex-row gap-10 items-center justify-between mb-5 md:mb-10">
                    <div className="flex items-center gap-3 font-serif text-3xl">
                        <h2>장바구니</h2>
                        <p className="text-primary">{cartItems.length}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-primary font-bold">장바구니</p>
                        <span>
                            <ArrowIcon
                                tailwind="w-[16px] h-[16px] text-black/40 hover-black-40"
                                rotate="90"
                            />
                        </span>
                        <p className="text-black/40">주문서 작성</p>
                        <span>
                            <ArrowIcon
                                tailwind="w-[16px] h-[16px] text-black/40 hover-black-40"
                                rotate="90"
                            />
                        </span>
                        <p className="text-black/40">주문 완료</p>
                    </div>
                </section>
                {cartItems.length === 0 ? (
                    <section className="globalWrapper w-full py-8 md:py-10 mb-10">
                        <EmptyCart />
                    </section>
                ) : (
                    <section className="globalWrapper mb-20 relative flex flex-col md:flex-row items-start justify-between gap-5">
                        <div className="flex-1 w-full border-t border-black">
                            <CartHeader
                                selectedItemsCount={selectedItemIds.size}
                                totalItemsCount={cartItems.length}
                                isAllSelected={isAllSelected}
                                onSelectAll={handleSelectAll}
                                onDeleteSelected={handleDeleteSelected}
                            />
                            <div className="border-t border-black/10">
                                <ul>
                                    {cartItems.map((item, index) => (
                                        <CartItem
                                            key={item.id || index}
                                            item={item}
                                            isSelected={selectedItemIds.has(item.id)}
                                            onSelect={handleItemSelect}
                                            onQuantityChange={handleQuantityChange}
                                            onDelete={handleDeleteItem}
                                        />
                                    ))}
                                </ul>
                                <div className="flex items-center justify-center p-4 bg-black/3 font-bold gap-1 text-xs">
                                    <p>상품 금액 : {totalOriginalPrice.toLocaleString()}원</p>
                                    <p>/</p>
                                    <p>배송비 : {DELIVERY_FEE.toLocaleString()}원</p>
                                    <InfoButton iconTailwind="w-4 h-4">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-sm mb-2">배송비 안내</h4>
                                            <div className="space-y-1 text-xs text-black/60">
                                                <p>• 국내 일반 지역: {DELIVERY_FEE.toLocaleString()}원</p>
                                                <p>• 제주 지역: {DELIVERY_FEE.toLocaleString()}원</p>
                                                <p>• 제주외 도서산간 지역: {DELIVERY_FEE.toLocaleString()}원</p>
                                            </div>
                                        </div>
                                    </InfoButton>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-[360px] md:shrink-0 md:sticky md:top-[60px]">
                            <CartSummary
                                selectedItemsCount={selectedItemIds.size}
                                totalPrice={totalPrice}
                                totalOriginalPrice={totalOriginalPrice}
                                totalDiscountAmount={totalDiscountAmount}
                                deliveryFee={DELIVERY_FEE}
                                onOrder={handleOrder}
                            />
                        </div>
                    </section>
                )}
            </div>

            {data && (
                <CartPurchaseBar
                    totalPrice={totalPrice}
                    totalLength={cartItems.length}
                    deliveryFee={DELIVERY_FEE}
                    onOrder={handleOrder}
                />
            )}
        </>
    );
}
