import React, { useEffect, useState, useRef } from 'react';
import { CartSkinProps, CartSummaryData } from './types';
import { CartHeader } from './components/CartHeader';
import { EmptyCart } from './components/EmptyCart';
import { CartItem } from './components/CartItem';
import { CartSummary } from './components/CartSummary';
import { CouponSection } from './components/CouponSection';
import { PointsSection } from './components/PointsSection';
import { MobilePurchaseBar } from './components/MobilePurchaseBar';
import './cart-skin.scss';

const CartSkin: React.FC<CartSkinProps> = ({ data, utils, actions }) => {
  const {
    items = [],
    selectedItemIds: initialSelectedIds = [],
    coupons = [],
    availablePoints = 0,
    usedPoints: initialUsedPoints = 0,
    deliveryInfo = { fee: 3000, freeShippingThreshold: 50000 },
    showCoupon = false,
    showPoints = false,
    emptyMessage,
    emptySubMessage,
    emptyButtonText,
    emptyButtonLink = '/shop'
  } = data || {};

  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set(initialSelectedIds));
  const [cartItems, setCartItems] = useState(items);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [usedPoints, setUsedPoints] = useState(initialUsedPoints);
  const [showMobilePurchaseBar, setShowMobilePurchaseBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  // 모바일 구매바 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setShowMobilePurchaseBar(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 전체 선택 여부
  const isAllSelected = cartItems.length > 0 && cartItems.every(item => selectedItemIds.has(item.id));

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItemIds(new Set(cartItems.map(item => item.id)));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  // 개별 선택
  const handleItemSelect = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedItemIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItemIds(newSelected);
  };

  // 수량 변경
  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  // 아이템 삭제
  const handleDeleteItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    const newSelected = new Set(selectedItemIds);
    newSelected.delete(id);
    setSelectedItemIds(newSelected);
  };

  // 선택 삭제
  const handleDeleteSelected = () => {
    setCartItems(cartItems.filter(item => !selectedItemIds.has(item.id)));
    setSelectedItemIds(new Set());
  };

  // 주문 요약 계산
  const calculateSummary = (): CartSummaryData => {
    const selectedItems = cartItems.filter(item => selectedItemIds.has(item.id));
    const selectedCount = selectedItems.length;
    
    const totalOriginalPrice = selectedItems.reduce((sum, item) => 
      sum + (item.originalPrice || item.price) * item.quantity, 0
    );
    
    const totalCurrentPrice = selectedItems.reduce((sum, item) => 
      sum + item.price * item.quantity, 0
    );
    
    const totalDiscountAmount = totalOriginalPrice - totalCurrentPrice;
    
    // 쿠폰 할인 계산
    let couponDiscountAmount = 0;
    if (selectedCouponId && coupons.length > 0) {
      const coupon = coupons.find(c => c.id === selectedCouponId);
      if (coupon && (!coupon.minOrderAmount || totalCurrentPrice >= coupon.minOrderAmount)) {
        if (coupon.discountType === 'percent') {
          couponDiscountAmount = Math.floor(totalCurrentPrice * coupon.discountValue / 100);
        } else {
          couponDiscountAmount = coupon.discountValue;
        }
      }
    }
    
    // 배송비 계산
    const deliveryFee = totalCurrentPrice >= (deliveryInfo.freeShippingThreshold || 0) ? 0 : deliveryInfo.fee;
    
    const totalPrice = totalCurrentPrice - couponDiscountAmount - usedPoints + deliveryFee;
    
    return {
      selectedCount,
      totalOriginalPrice,
      totalDiscountAmount,
      couponDiscountAmount,
      pointsDiscountAmount: usedPoints,
      deliveryFee,
      totalPrice: Math.max(0, totalPrice)
    };
  };

  const summary = calculateSummary();

  // 주문하기
  const handleOrder = () => {
    if (actions?.proceedToCheckout) {
      actions.proceedToCheckout({
        selectedItems: cartItems.filter(item => selectedItemIds.has(item.id)),
        couponId: selectedCouponId,
        usedPoints,
        summary
      });
    } else if (utils?.navigate) {
      utils.navigate('/order');
    }
  };

  // 빈 카트 버튼 클릭
  const handleEmptyCartButton = () => {
    if (utils?.navigate) {
      utils.navigate(emptyButtonLink);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-skin empty" ref={containerRef}>
        <EmptyCart
          message={emptyMessage}
          subMessage={emptySubMessage}
          buttonText={emptyButtonText}
          onButtonClick={handleEmptyCartButton}
        />
      </div>
    );
  }

  return (
    <div className="cart-skin" ref={containerRef}>
      <div className="cart-container">
        <div className="cart-content">
          <CartHeader
            totalCount={cartItems.length}
            selectedCount={selectedItemIds.size}
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
            onDeleteSelected={handleDeleteSelected}
          />
          
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                isSelected={selectedItemIds.has(item.id)}
                onSelect={handleItemSelect}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
          
          {(showCoupon || showPoints) && (
            <div className="discount-sections">
              {showCoupon && coupons.length > 0 && (
                <CouponSection
                  coupons={coupons}
                  selectedCouponId={selectedCouponId}
                  onCouponSelect={setSelectedCouponId}
                />
              )}
              
              {showPoints && availablePoints > 0 && (
                <PointsSection
                  availablePoints={availablePoints}
                  usedPoints={usedPoints}
                  onPointsChange={setUsedPoints}
                />
              )}
            </div>
          )}
        </div>
        
        <div className="cart-sidebar">
          <CartSummary
            summary={summary}
            deliveryInfo={deliveryInfo}
            onOrder={handleOrder}
            showCoupon={showCoupon}
            showPoints={showPoints}
          />
        </div>
      </div>
      
      <MobilePurchaseBar
        totalPrice={summary.totalPrice}
        selectedCount={summary.selectedCount}
        onOrder={handleOrder}
        isVisible={showMobilePurchaseBar}
      />
    </div>
  );
};

export default CartSkin;