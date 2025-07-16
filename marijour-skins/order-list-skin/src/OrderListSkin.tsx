import React, { useState, useEffect } from 'react';
import { OrderListSkinProps, OrderListData, OrderListItem } from './types';
import './order-list-skin.scss';

const ArrowIcon = ({ rotate = '0' }: { rotate?: string }) => (
    <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${rotate}deg)` }}
    >
        <path 
            d="M7 10L12 15L17 10" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
);

const OrderItemComponent = ({ 
    item, 
    imageSize = 'md', 
    layout = 'horizontal',
    onItemClick,
    utils
}: { 
    item: OrderListItem; 
    imageSize?: 'sm' | 'md' | 'lg';
    layout?: 'horizontal' | 'vertical';
    onItemClick?: (itemId: number) => void;
    utils: any;
}) => {
    const imageSizeMap = {
        sm: { width: '50px', height: '50px' },
        md: { width: '70px', height: '70px' },
        lg: { width: '100px', height: '100px' }
    };

    const handleItemClick = () => {
        onItemClick?.(item.id);
        utils.navigate(`/products/${item.id}`);
    };

    const totalPrice = item.price * item.quantity;

    return (
        <div className={utils.cx('order-item', layout)}>
            <div 
                className="order-item-image"
                style={imageSizeMap[imageSize]}
                onClick={handleItemClick}
            >
                <img
                    src={utils.getAssetUrl(item.thumbnailUrl)}
                    alt={item.name}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div className="order-item-content">
                <h4 className="item-name" onClick={handleItemClick}>
                    {item.name}
                </h4>
                <div className="item-details">
                    <span className="quantity">{item.quantity}개</span>
                    <span className="separator"></span>
                    <span className="price">{utils.formatCurrency(totalPrice)}</span>
                </div>
            </div>
        </div>
    );
};

export const OrderListSkin: React.FC<OrderListSkinProps> = ({ 
    data, 
    actions, 
    options, 
    mode, 
    utils 
}) => {
    const orders = data.orders || options.orders || [];
    const [visibleOrders, setVisibleOrders] = useState<number[]>([]);

    useEffect(() => {
        if (options.enableAnimation) {
            orders.forEach((_, index) => {
                const delay = (options.animationDelay || 0.1) * index * 1000;
                setTimeout(() => {
                    setVisibleOrders(prev => [...prev, index]);
                }, delay);
            });
        } else {
            setVisibleOrders(orders.map((_, index) => index));
        }
    }, [orders, options.enableAnimation, options.animationDelay]);

    if (!orders || orders.length === 0) {
        return (
            <div className="order-list-empty">
                <p>{options.emptyStateMessage || utils.t('no_orders', '주문 내역이 없습니다.')}</p>
            </div>
        );
    }

    const showButton = options.showButton !== false && options.buttonText;
    const showOrderStatus = options.showOrderStatus !== false;
    const showOrderNumber = options.showOrderNumber !== false;
    const showOrderDate = options.showOrderDate !== false;
    const enableOrderDetailLink = options.enableOrderDetailLink !== false;
    const enableItemLink = options.enableItemLink !== false;
    const showBorder = options.showBorder !== false;
    const showOrderBorder = options.showOrderBorder !== false;
    const showItemBorder = options.showItemBorder !== false;
    const layout = options.layout || 'list';

    const handleOrderDetailClick = (orderNumber: string) => {
        if (enableOrderDetailLink) {
            actions.onOrderDetailClick?.(orderNumber);
            utils.navigate(`/my-page/orders/detail/${orderNumber}`);
        }
    };

    const handleButtonClick = (orderNumber: string, item: OrderListItem) => {
        if (options.buttonHref) {
            utils.navigate(options.buttonHref);
        }
        actions.onButtonClick?.(orderNumber, item);
    };

    const handleItemClick = (itemId: number) => {
        if (enableItemLink) {
            actions.onItemClick?.(itemId);
        }
    };

    const containerStyle = {
        '--bg-color': options.backgroundColor || 'transparent',
        '--border-color': options.borderColor || '#000',
        '--border-radius': options.borderRadius || '0',
        '--padding': options.padding || '0',
        '--margin': options.margin || '0',
        '--order-spacing': options.orderSpacing || '42px',
        '--item-spacing': options.itemSpacing || '16px',
        '--header-spacing': options.headerSpacing || '16px',
        '--animation-duration': options.animationDuration ? `${options.animationDuration}s` : '0.3s'
    } as React.CSSProperties;

    const orderHeaderStyle = {
        fontSize: options.orderHeaderFontSize || '16px',
        fontWeight: options.orderHeaderFontWeight || '600',
        color: options.orderHeaderColor || '#000'
    };

    const orderDateStyle = {
        fontSize: options.orderDateFontSize || '16px',
        color: options.orderDateColor || '#000'
    };

    const orderNumberStyle = {
        fontSize: options.orderNumberFontSize || '14px',
        color: options.orderNumberColor || 'rgba(0, 0, 0, 0.6)'
    };

    const orderStatusStyle = {
        fontSize: options.orderStatusFontSize || '14px',
        color: options.orderStatusColor || '#2563eb',
        fontWeight: '600'
    };

    const buttonStyle = {
        fontSize: options.buttonFontSize || '14px',
        color: options.buttonColor || '#000',
        backgroundColor: options.buttonBgColor || 'transparent',
        borderColor: options.buttonBorderColor || '#e5e5e5',
        borderRadius: options.buttonBorderRadius || '4px',
        padding: options.buttonPadding || '6px 24px',
        '--hover-bg': options.buttonHoverBgColor || '#f5f5f5'
    } as React.CSSProperties;

    return (
        <div 
            className={utils.cx(
                'order-list-skin',
                layout,
                showBorder && 'with-border',
                showOrderBorder && 'with-order-border',
                showItemBorder && 'with-item-border',
                options.enableAnimation && 'with-animation'
            )}
            style={containerStyle}
        >
            <ul className="order-list">
                {orders.map((order, orderIndex) => (
                    <li
                        key={order.orderNumber}
                        className={utils.cx(
                            'order-item-container',
                            options.enableAnimation && 'animated',
                            options.animationType || 'fade',
                            visibleOrders.includes(orderIndex) && 'visible'
                        )}
                    >
                        <div className="order-header">
                            {showOrderDate && (
                                <span className="order-date" style={orderDateStyle}>
                                    {utils.formatDate(order.orderDate)}
                                </span>
                            )}
                            
                            {showOrderNumber && (
                                <>
                                    <span className="separator"></span>
                                    <button
                                        className="order-number-link"
                                        style={orderNumberStyle}
                                        onClick={() => handleOrderDetailClick(order.orderNumber)}
                                    >
                                        <span>
                                            {options.orderNumberPrefix || utils.t('order_number', '주문 번호')} : {order.orderNumber}
                                        </span>
                                        <ArrowIcon rotate="90" />
                                    </button>
                                </>
                            )}
                        </div>

                        <ul className="order-items">
                            {order.items.map((item) => (
                                <li key={item.id} className="order-item-row">
                                    <div className="order-item-wrapper">
                                        <OrderItemComponent
                                            item={item}
                                            imageSize={options.itemImageSize}
                                            layout={options.itemLayout}
                                            onItemClick={handleItemClick}
                                            utils={utils}
                                        />
                                    </div>
                                    
                                    <div className="order-item-actions">
                                        {showOrderStatus && (
                                            <span className="order-status" style={orderStatusStyle}>
                                                {item.orderStatus}
                                            </span>
                                        )}
                                        
                                        {showButton && (
                                            <button
                                                className="action-button"
                                                style={buttonStyle}
                                                onClick={() => handleButtonClick(order.orderNumber, item)}
                                            >
                                                {options.buttonText}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderListSkin;