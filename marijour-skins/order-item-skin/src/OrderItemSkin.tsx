import React, { useState, useEffect } from 'react';
import { OrderItemSkinProps, OrderItem } from './types';
import './order-item-skin.scss';

export const OrderItemSkin: React.FC<OrderItemSkinProps> = ({ 
    data, 
    actions, 
    options, 
    mode, 
    utils 
}) => {
    const orderItem = data.orderItem || options.orderItem;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (options.enableAnimation) {
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [options.enableAnimation]);

    if (!orderItem) {
        return (
            <div className="order-item-placeholder">
                <div className="placeholder-image"></div>
                <div className="placeholder-content">
                    <div className="placeholder-name"></div>
                    <div className="placeholder-details"></div>
                </div>
            </div>
        );
    }

    const {
        id,
        name,
        thumbnailUrl,
        quantity,
        price
    } = orderItem;

    const totalPrice = price * quantity;
    const enableProductLink = options.enableProductLink !== false;
    const enableImageClick = options.enableImageClick !== false;
    const showQuantity = options.showQuantity !== false;
    const showPrice = options.showPrice !== false;
    const showTotalPrice = options.showTotalPrice !== false;
    const showSeparator = options.showSeparator !== false && showQuantity && (showPrice || showTotalPrice);
    const layout = options.layout || 'horizontal';
    const imagePosition = options.imagePosition || 'left';
    const textAlign = options.textAlign || 'left';

    const handleItemClick = () => {
        if (enableProductLink) {
            actions.onItemClick?.(id);
            utils.navigate(`/products/${id}`);
        }
    };

    const handleImageClick = () => {
        if (enableImageClick) {
            actions.onImageClick?.(id);
            if (enableProductLink) {
                utils.navigate(`/products/${id}`);
            }
        }
    };

    const containerStyle = {
        '--bg-color': options.backgroundColor || 'transparent',
        '--border-radius': options.borderRadius || '0',
        '--padding': options.padding || '0',
        '--margin': options.margin || '0',
        '--item-spacing': options.itemSpacing || '16px',
        '--content-spacing': options.contentSpacing || '8px',
        '--animation-duration': options.animationDuration ? `${options.animationDuration}s` : '0.3s'
    } as React.CSSProperties;

    const imageSize = options.imageSize || 'md';
    const imageSizeMap = {
        sm: { width: '50px', height: '50px' },
        md: { width: '70px', height: '70px' },
        lg: { width: '100px', height: '100px' }
    };

    const imageStyle = {
        ...imageSizeMap[imageSize],
        aspectRatio: options.imageAspectRatio || '1'
    };

    const nameStyle = {
        fontSize: options.productNameFontSize || '14px',
        fontWeight: options.productNameFontWeight || '600',
        color: options.productNameColor || '#000',
        WebkitLineClamp: options.productNameMaxLines || 2,
        textAlign: textAlign
    } as React.CSSProperties;

    const quantityStyle = {
        fontSize: options.quantityFontSize || '14px',
        color: options.quantityColor || '#000'
    };

    const priceStyle = {
        fontSize: options.priceFontSize || '14px',
        color: options.priceColor || '#000'
    };

    const separatorStyle = {
        backgroundColor: options.separatorColor || 'rgba(0, 0, 0, 0.2)',
        width: options.separatorWidth || '1px'
    };

    return (
        <div 
            className={utils.cx(
                'order-item-skin',
                layout,
                imagePosition === 'top' && 'image-top',
                textAlign !== 'left' && `text-${textAlign}`,
                options.enableAnimation && 'with-animation',
                options.animationType || 'fade',
                isVisible && 'visible'
            )}
            style={containerStyle}
        >
            <div 
                className="order-item-image"
                style={imageStyle}
                onClick={handleImageClick}
            >
                <img
                    src={utils.getAssetUrl(thumbnailUrl)}
                    alt={name}
                    className="product-image"
                    style={{ 
                        cursor: enableImageClick ? 'pointer' : 'default',
                        objectFit: 'cover'
                    }}
                />
            </div>

            <div className="order-item-content">
                <h3 
                    className="product-name"
                    style={nameStyle}
                    onClick={handleItemClick}
                >
                    {name}
                </h3>
                
                <div className="product-details">
                    {showQuantity && (
                        <span className="quantity-info" style={quantityStyle}>
                            {quantity}{utils.t('pieces', '개')}
                        </span>
                    )}
                    
                    {showSeparator && (
                        <span className="separator" style={separatorStyle}></span>
                    )}
                    
                    {showPrice && !showTotalPrice && (
                        <span className="price-info" style={priceStyle}>
                            {utils.formatCurrency(price)}
                        </span>
                    )}
                    
                    {showTotalPrice && (
                        <span className="total-price-info" style={priceStyle}>
                            {utils.formatCurrency(totalPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderItemSkin;