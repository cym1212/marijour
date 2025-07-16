import React, { useState, useEffect } from 'react';
import { OrderSummarySkinProps, OrderSummaryData } from './types';
import './order-summary-skin.scss';

export const OrderSummarySkin: React.FC<OrderSummarySkinProps> = ({ 
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
            <div className="order-summary-placeholder">
                <div className="placeholder-title"></div>
                <div className="placeholder-section">
                    <div className="placeholder-main-row"></div>
                    <div className="placeholder-sub-rows">
                        <div className="placeholder-sub-row"></div>
                        <div className="placeholder-sub-row"></div>
                        <div className="placeholder-sub-row"></div>
                    </div>
                </div>
                <div className="placeholder-row"></div>
                <div className="placeholder-total"></div>
                <div className="placeholder-button"></div>
            </div>
        );
    }

    const {
        totalPrice,
        totalOriginalPrice,
        totalDiscountAmount,
        couponDiscountAmount = 0,
        rewardDiscountAmount = 0,
        deliveryFee
    } = summary;

    // 상품 할인 금액 계산 (총 할인에서 쿠폰/적립금 할인 제외)
    const productDiscountAmount = totalDiscountAmount - couponDiscountAmount - rewardDiscountAmount;
    // 할인 적용된 상품 금액
    const actualProductPrice = totalOriginalPrice - productDiscountAmount;
    // 최종 결제 금액
    const finalTotalPrice = totalPrice + deliveryFee;

    const showTitle = options.showTitle !== false;
    const showTotalOriginalPrice = options.showTotalOriginalPrice !== false;
    const showProductPrice = options.showProductPrice !== false;
    const showProductDiscount = options.showProductDiscount !== false && productDiscountAmount > 0;
    const showCouponDiscount = options.showCouponDiscount !== false && couponDiscountAmount > 0;
    const showRewardDiscount = options.showRewardDiscount !== false && rewardDiscountAmount > 0;
    const showDeliveryFee = options.showDeliveryFee !== false;
    const showOrderButton = options.showOrderButton !== false;
    const showBorder = options.showBorder !== false;
    const showSectionBorders = options.showSectionBorders !== false;
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
        '--sublabel-indent': options.sublabelIndent || '12px',
        '--animation-duration': options.animationDuration ? `${options.animationDuration}s` : '0.3s'
    } as React.CSSProperties;

    const titleStyle = {
        fontSize: options.titleFontSize || '18px',
        fontWeight: options.titleFontWeight || '600',
        color: options.titleColor || '#000'
    };

    const labelStyle = {
        fontSize: options.labelFontSize || '14px',
        color: options.labelColor || 'rgba(0, 0, 0, 0.7)',
        fontWeight: '500'
    };

    const sublabelStyle = {
        fontSize: options.sublabelFontSize || '14px',
        color: options.sublabelColor || '#000'
    };

    const valueStyle = {
        fontSize: options.valueFontSize || '14px',
        color: options.valueColor || '#000',
        fontWeight: '500'
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
                'order-summary-skin',
                layout,
                showBorder && 'with-border',
                showSectionBorders && 'with-section-borders',
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
                {/* 총 상품 금액 섹션 */}
                <div className="summary-section product-section">
                    {showTotalOriginalPrice && (
                        <div className="summary-row main-row">
                            <span className="summary-label" style={labelStyle}>
                                {utils.t('total_product_price', '총 상품 금액')}
                            </span>
                            <span className="summary-value" style={valueStyle}>
                                {utils.formatCurrency(totalOriginalPrice)}
                            </span>
                        </div>
                    )}
                    
                    <div className="summary-subsection">
                        {showProductPrice && (
                            <div className="summary-row sub-row">
                                <span className="summary-label" style={sublabelStyle}>
                                    {utils.t('product_price', '상품 금액')}
                                </span>
                                <span className="summary-value" style={valueStyle}>
                                    {utils.formatCurrency(actualProductPrice)}
                                </span>
                            </div>
                        )}
                        
                        {showProductDiscount && (
                            <div className="summary-row sub-row">
                                <span className="summary-label" style={sublabelStyle}>
                                    {utils.t('product_discount', '상품 할인')}
                                </span>
                                <span className="summary-value discount" style={discountStyle}>
                                    -{utils.formatCurrency(productDiscountAmount)}
                                </span>
                            </div>
                        )}
                        
                        {showCouponDiscount && (
                            <div className="summary-row sub-row">
                                <span className="summary-label" style={sublabelStyle}>
                                    {utils.t('coupon_discount', '쿠폰 할인')}
                                </span>
                                <span className="summary-value discount" style={discountStyle}>
                                    -{utils.formatCurrency(couponDiscountAmount)}
                                </span>
                            </div>
                        )}
                        
                        {showRewardDiscount && (
                            <div className="summary-row sub-row">
                                <span className="summary-label" style={sublabelStyle}>
                                    {utils.t('reward_discount', '적립금 할인')}
                                </span>
                                <span className="summary-value discount" style={discountStyle}>
                                    -{utils.formatCurrency(rewardDiscountAmount)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* 배송비 */}
                {showDeliveryFee && (
                    <div className="summary-section delivery-section">
                        <div className="summary-row">
                            <span className="summary-label" style={sublabelStyle}>
                                {utils.t('delivery_fee', '배송비')}
                            </span>
                            <span className="summary-value" style={valueStyle}>
                                {deliveryFee === 0 ? utils.t('free', '무료') : utils.formatCurrency(deliveryFee)}
                            </span>
                        </div>
                    </div>
                )}
                
                {/* 총 결제 금액 */}
                <div className="summary-section total-section">
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
            
            {/* 버튼 영역 */}
            {(showOrderButton || options.customButtons) && (
                <div className="summary-button-container">
                    {options.customButtons ? (
                        <div className="custom-buttons">
                            {options.customButtons}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="order-button"
                            style={buttonStyle}
                            onClick={handleOrder}
                        >
                            {options.orderButtonText || utils.t('place_order', '주문하기')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderSummarySkin;