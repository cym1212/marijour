import React, { useState, useEffect } from 'react';
import { CartSummarySkinProps, CartSummaryData } from './types';
import './cart-summary-skin.scss';

export const CartSummarySkin: React.FC<CartSummarySkinProps> = ({ 
    data, 
    actions, 
    options, 
    mode, 
    utils 
}) => {
    const summary = data.summary || options.summary;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (options.enableAnimation) {
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [options.enableAnimation]);

    if (!summary) {
        return (
            <div className="cart-summary-placeholder">
                <div className="placeholder-title"></div>
                <div className="placeholder-rows">
                    <div className="placeholder-row"></div>
                    <div className="placeholder-row"></div>
                    <div className="placeholder-row"></div>
                    <div className="placeholder-total"></div>
                </div>
                <div className="placeholder-button"></div>
            </div>
        );
    }

    const {
        selectedItemsCount,
        totalPrice,
        totalOriginalPrice,
        totalDiscountAmount,
        deliveryFee,
        couponDiscountAmount = 0,
        rewardDiscountAmount = 0
    } = summary;

    const finalTotalPrice = totalPrice + deliveryFee - couponDiscountAmount - rewardDiscountAmount;

    const showTitle = options.showTitle !== false;
    const showOriginalPrice = options.showOriginalPrice !== false;
    const showDiscountAmount = options.showDiscountAmount !== false;
    const showDeliveryFee = options.showDeliveryFee !== false;
    const showCouponDiscount = options.showCouponDiscount && couponDiscountAmount > 0;
    const showRewardDiscount = options.showRewardDiscount && rewardDiscountAmount > 0;
    const showOrderButton = options.showOrderButton !== false;
    const showBorder = options.showBorder !== false;
    const layout = options.layout || 'vertical';

    const handleOrder = () => {
        actions.onOrder?.();
    };

    const containerStyle = {
        '--bg-color': options.backgroundColor || 'rgba(0, 0, 0, 0.03)',
        '--border-color': options.borderColor || 'rgba(0, 0, 0, 0.1)',
        '--border-radius': options.borderRadius || '0',
        '--padding': options.padding || '20px',
        '--margin': options.margin || '0',
        '--item-spacing': options.itemSpacing || '12px',
        '--animation-duration': options.animationDuration ? `${options.animationDuration}s` : '0.3s'
    } as React.CSSProperties;

    const titleStyle = {
        fontSize: options.titleFontSize || '18px',
        fontWeight: options.titleFontWeight || '600',
        color: options.titleColor || '#000'
    };

    const labelStyle = {
        fontSize: options.labelFontSize || '14px',
        color: options.labelColor || '#000'
    };

    const valueStyle = {
        fontSize: options.valueFontSize || '14px',
        color: options.valueColor || '#000'
    };

    const discountStyle = {
        fontSize: options.valueFontSize || '14px',
        color: options.discountColor || '#dc2626'
    };

    const totalPriceStyle = {
        fontSize: options.totalPriceFontSize || '18px',
        fontWeight: '600',
        color: options.totalPriceColor || '#2563eb'
    };

    const buttonStyle = {
        fontSize: options.buttonFontSize || '16px',
        fontWeight: options.buttonFontWeight || '600',
        color: options.buttonColor || '#fff',
        backgroundColor: options.buttonBgColor || '#2563eb',
        borderRadius: options.buttonBorderRadius || '8px',
        padding: options.buttonPadding || '14px 24px',
        '--hover-bg': options.buttonHoverBgColor || '#1d4ed8',
        '--disabled-bg': options.buttonDisabledBgColor || '#9ca3af'
    } as React.CSSProperties;

    return (
        <div 
            className={utils.cx(
                'cart-summary-skin',
                layout,
                showBorder && 'with-border',
                options.enableAnimation && 'with-animation',
                options.animationType || 'fade',
                isVisible && 'visible'
            )}
            style={containerStyle}
        >
            {showTitle && (
                <h3 className="summary-title" style={titleStyle}>
                    {options.title || utils.t('order_summary', '주문 정보')}
                </h3>
            )}
            
            <div className="summary-content">
                {showOriginalPrice && (
                    <div className="summary-row">
                        <span className="summary-label" style={labelStyle}>
                            {utils.t('total_product_price', '총 상품 금액')}
                        </span>
                        <span className="summary-value" style={valueStyle}>
                            {utils.formatCurrency(totalOriginalPrice)}
                        </span>
                    </div>
                )}
                
                {showDiscountAmount && totalDiscountAmount > 0 && (
                    <div className="summary-row">
                        <span className="summary-label" style={labelStyle}>
                            {utils.t('total_discount_amount', '총 할인 금액')}
                        </span>
                        <span className="summary-value discount" style={discountStyle}>
                            -{utils.formatCurrency(totalDiscountAmount)}
                        </span>
                    </div>
                )}
                
                {showDeliveryFee && (
                    <div className="summary-row">
                        <span className="summary-label" style={labelStyle}>
                            {utils.t('delivery_fee', '배송비')}
                        </span>
                        <span className="summary-value" style={valueStyle}>
                            {deliveryFee === 0 ? utils.t('free', '무료') : utils.formatCurrency(deliveryFee)}
                        </span>
                    </div>
                )}
                
                {showCouponDiscount && (
                    <div className="summary-row">
                        <span className="summary-label" style={labelStyle}>
                            {utils.t('coupon_discount', '쿠폰 할인')}
                        </span>
                        <span className="summary-value discount" style={discountStyle}>
                            -{utils.formatCurrency(couponDiscountAmount)}
                        </span>
                    </div>
                )}
                
                {showRewardDiscount && (
                    <div className="summary-row">
                        <span className="summary-label" style={labelStyle}>
                            {utils.t('reward_discount', '적립금 사용')}
                        </span>
                        <span className="summary-value discount" style={discountStyle}>
                            -{utils.formatCurrency(rewardDiscountAmount)}
                        </span>
                    </div>
                )}
                
                <div className="summary-total">
                    <div className="summary-row total-row">
                        <span className="summary-label total-label" style={labelStyle}>
                            {utils.t('total_payment_amount', '총 결제 금액')}
                        </span>
                        <span className="summary-value total-value" style={totalPriceStyle}>
                            {utils.formatCurrency(finalTotalPrice)}
                        </span>
                    </div>
                </div>
            </div>
            
            {showOrderButton && (
                <div className="summary-button-container">
                    <button
                        type="button"
                        className={utils.cx(
                            'order-button',
                            (options.orderButtonDisabled || selectedItemsCount === 0) && 'disabled'
                        )}
                        style={buttonStyle}
                        onClick={handleOrder}
                        disabled={options.orderButtonDisabled || selectedItemsCount === 0}
                    >
                        {options.orderButtonText || utils.t('place_order', '주문하기')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartSummarySkin;