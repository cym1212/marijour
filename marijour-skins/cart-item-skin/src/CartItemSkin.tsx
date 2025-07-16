import React, { useState, useEffect } from 'react';
import { CartItemSkinProps, CartItem } from './types';
import './cart-item-skin.scss';

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Checkbox = ({ id, checked, onChange, size = 'md' }: { id: string; checked: boolean; onChange: (checked: boolean) => void; size?: 'sm' | 'md' | 'lg' }) => (
    <div className={`checkbox-container ${size}`}>
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="checkbox-input"
        />
        <label htmlFor={id} className="checkbox-label">
            <div className="checkbox-box">
                {checked && <CheckIcon />}
            </div>
        </label>
    </div>
);

const Steppers = ({ 
    count, 
    setCount, 
    size = 'md', 
    color = '#000',
    bgColor = '#fff',
    borderColor = '#e5e5e5'
}: { 
    count: number; 
    setCount: (count: number) => void; 
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    bgColor?: string;
    borderColor?: string;
}) => {
    const decrease = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const increase = () => {
        setCount(count + 1);
    };

    return (
        <div className={`steppers ${size}`} style={{ '--btn-color': color, '--btn-bg': bgColor, '--btn-border': borderColor } as React.CSSProperties}>
            <button type="button" onClick={decrease} disabled={count <= 1} className="steppers-btn">
                -
            </button>
            <span className="steppers-count">{count}</span>
            <button type="button" onClick={increase} className="steppers-btn">
                +
            </button>
        </div>
    );
};

const ProductPrice = ({ 
    price, 
    discountRate, 
    originalPrice, 
    lineBreak = false, 
    showDiscount = true, 
    showOriginal = true,
    fontSize = '14px',
    fontWeight = '500',
    color = '#000'
}: { 
    price: number; 
    discountRate?: number; 
    originalPrice?: number; 
    lineBreak?: boolean; 
    showDiscount?: boolean; 
    showOriginal?: boolean;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
}) => {
    const hasDiscount = discountRate && discountRate > 0;
    const displayOriginalPrice = showOriginal && originalPrice && originalPrice > price;

    return (
        <div className={`product-price ${lineBreak ? 'line-break' : ''}`} style={{ fontSize, fontWeight, color }}>
            {hasDiscount && showDiscount && (
                <span className="discount-rate">{discountRate}%</span>
            )}
            <span className="current-price">{price.toLocaleString()}원</span>
            {displayOriginalPrice && (
                <span className="original-price">{originalPrice.toLocaleString()}원</span>
            )}
        </div>
    );
};

export const CartItemSkin: React.FC<CartItemSkinProps> = ({ 
    data, 
    actions, 
    options, 
    mode, 
    utils 
}) => {
    const cartItem = data.cartItem || options.cartItem;
    const [isSelected, setIsSelected] = useState(options.isSelected || false);
    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (options.enableAnimation) {
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [options.enableAnimation]);

    if (!cartItem) {
        return (
            <div className="cart-item-placeholder">
                <div className="placeholder-checkbox"></div>
                <div className="placeholder-image"></div>
                <div className="placeholder-content">
                    <div className="placeholder-title"></div>
                    <div className="placeholder-price"></div>
                </div>
            </div>
        );
    }

    const handleSelect = (checked: boolean) => {
        setIsSelected(checked);
        actions.onSelect?.(cartItem.id, checked);
    };

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
        actions.onQuantityChange?.(cartItem.id, newQuantity);
    };

    const handleDelete = () => {
        actions.onDelete?.(cartItem.id);
    };

    const handleItemClick = () => {
        if (options.enableProductLink) {
            actions.onItemClick?.(cartItem.id);
            utils.navigate(`/products/${cartItem.id}`);
        }
    };

    const totalPrice = cartItem.price * quantity;
    const layout = options.layout || 'horizontal';
    const showBorder = options.showBorder !== false;
    const enableSelection = options.enableSelection !== false;
    const enableQuantityControl = options.enableQuantityControl !== false;
    const enableDelete = options.enableDelete !== false;

    const containerStyle = {
        '--bg-color': options.backgroundColor || 'transparent',
        '--border-color': options.borderColor || 'rgba(0, 0, 0, 0.1)',
        '--border-radius': options.borderRadius || '0',
        '--padding': options.padding || '20px 0',
        '--margin': options.margin || '0',
        '--animation-duration': options.animationDuration ? `${options.animationDuration}s` : '0.3s'
    } as React.CSSProperties;

    const imageSize = options.imageSize || 'md';
    const imageSizeMap = {
        sm: '60px',
        md: '120px',
        lg: '150px'
    };

    return (
        <div 
            className={utils.cx(
                'cart-item-skin',
                layout,
                showBorder && 'with-border',
                options.enableAnimation && 'with-animation',
                options.animationType || 'fade',
                isVisible && 'visible'
            )}
            style={containerStyle}
        >
            {enableSelection && (
                <div className="cart-item-checkbox">
                    <Checkbox
                        id={cartItem.id.toString()}
                        checked={isSelected}
                        onChange={handleSelect}
                        size={options.checkboxSize || 'md'}
                    />
                </div>
            )}
            
            <div 
                className="cart-item-image"
                style={{
                    width: imageSizeMap[imageSize],
                    height: imageSizeMap[imageSize],
                    aspectRatio: options.imageAspectRatio || '1'
                }}
            >
                <img
                    src={utils.getAssetUrl(cartItem.thumbnailUrl)}
                    alt={cartItem.name}
                    className="product-image"
                    onClick={handleItemClick}
                    style={{ cursor: options.enableProductLink ? 'pointer' : 'default' }}
                />
            </div>

            <div className="cart-item-content">
                <div className="cart-item-header">
                    <div className="product-info">
                        <h3 
                            className="product-name"
                            style={{
                                fontSize: options.productNameFontSize || '14px',
                                fontWeight: options.productNameFontWeight || '600',
                                color: options.productNameColor || '#000',
                                WebkitLineClamp: options.productNameMaxLines || 2
                            }}
                        >
                            {cartItem.name}
                        </h3>
                        <ProductPrice
                            price={cartItem.price}
                            discountRate={cartItem.discountRate}
                            originalPrice={cartItem.originalPrice}
                            lineBreak={true}
                            showDiscount={options.showDiscountRate !== false}
                            showOriginal={options.showOriginalPrice !== false}
                            fontSize={options.priceFontSize || '14px'}
                            fontWeight={options.priceFontWeight || '500'}
                            color={options.priceColor || '#000'}
                        />
                    </div>
                    
                    {enableDelete && (
                        <button
                            type="button"
                            aria-label="상품 삭제"
                            className={`delete-btn ${options.deleteButtonSize || 'md'}`}
                            onClick={handleDelete}
                            style={{
                                color: options.deleteButtonColor || '#666',
                                '--hover-color': options.deleteButtonHoverColor || '#000'
                            } as React.CSSProperties}
                        >
                            <CloseIcon />
                        </button>
                    )}
                </div>

                <div className="cart-item-footer">
                    {enableQuantityControl && (
                        <Steppers
                            count={quantity}
                            setCount={handleQuantityChange}
                            size={options.quantityButtonSize || 'md'}
                            color={options.quantityButtonColor || '#000'}
                            bgColor={options.quantityButtonBgColor || '#fff'}
                            borderColor={options.quantityButtonBorderColor || '#e5e5e5'}
                        />
                    )}
                    
                    <p 
                        className="total-price"
                        style={{
                            fontSize: options.totalPriceFontSize || '16px',
                            fontWeight: options.totalPriceFontWeight || '600',
                            color: options.totalPriceColor || '#000'
                        }}
                    >
                        {utils.formatCurrency(totalPrice)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItemSkin;