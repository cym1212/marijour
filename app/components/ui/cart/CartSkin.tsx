import React from 'react';

// 스타일 import
import './cart-skin-scoped.css';

// Base64 이미지 import
import { CART_PRODUCT_IMAGES } from './cart-images';

// TypeScript 인터페이스 정의
interface CartItem {
  id: number;
  count: number;                   // ⭐ quantity → count
  productId: number;
  variantId?: number | null;
  variant?: CartVariant | null;
  options?: Record<string, any> | null;
  product: {
    id: number;
    title: string;
    config?: {
      img_url?: string;
      default_price?: number;
      discounted_price?: number;
      stock_count?: number;
      [key: string]: any;
    };
    optionJson?: {                 // ⭐ 직급별 가격 등 추가 정보
      level2_price?: Record<string, number>;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

interface CartVariant {
  id: number;
  productId: number;
  sku: string;
  barcode?: string | null;
  additionalPrice: string;
  additionalPv: string;
  stock: number;
  options?: Array<{
    variantId: number;
    optionValueId: number;
    optionValue: {
      id: number;
      value: string;
      optionGroup: {
        id: number;
        name: string;
      };
    };
  }>;
}

interface Calculations {
  subtotal: number;
  shippingFee: number;             // ⭐ discountAmount 제거
  total: number;
}

interface PriceInfo {
  originalPrice: number;
  levelPrice: number;
  discount: number;
  discountRate: number;
  levelName: string | null;
}

interface ComponentSkinProps {
  data?: {
    cartItems?: CartItem[];
    loading?: boolean;
    calculations?: Calculations;
    localQuantities?: { [key: string]: number };
    freeShippingLimit?: number;
    user?: {
      level?: string;
      levelName?: string;
    };
    isUserLoggedIn?: boolean;
    isAdminMode?: boolean;
    theme?: Record<string, any>;
    [key: string]: any;
  };
  actions?: {
    handleIncreaseQuantity?: (itemId: string) => Promise<void>;
    handleDecreaseQuantity?: (itemId: string) => Promise<void>;
    handleRemoveItem?: (itemId: string) => Promise<void>;
    handleCheckout?: () => Promise<void>;
    handleClearCart?: () => Promise<void>;
    calculateLevelPrice?: (item: CartItem, level: string) => PriceInfo;
  };
  options?: {
    title?: string;
    emptyText?: string;
    showImage?: boolean;
    showQuantitySelector?: boolean;
    showRemoveButton?: boolean;
    primaryButtonColor?: string;
    priceColor?: string;
    [key: string]: any;
  };
  mode?: 'editor' | 'preview' | 'production';
  utils?: {
    t?: (key: string, params?: Record<string, any>) => string;
    navigate?: (path: string) => void;
    formatCurrency?: (amount: number, currency?: string) => string;
    cx?: (...classes: (string | undefined | null | false)[]) => string;
  };
  app?: {
    user?: any;
    company?: any;
    theme?: any;
    isUserLoggedIn?: boolean;
  };
  editor?: {
    isSelected?: boolean;
    onSelect?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
  };
}

// 더미 데이터 (관리자 모드에서 사용)
const DUMMY_CART_DATA: CartItem[] = [
  {
    id: 1,
    productId: 1,
    count: 2,
    variantId: null,
    variant: null,
    options: null,
    product: {
      id: 1,
      title: '레고트 누프레임 커플잔 2P',
      config: {
        img_url: CART_PRODUCT_IMAGES.product1,
        default_price: 40000,
        discounted_price: 32000,
        stock_count: 10
      },
      optionJson: {
        level2_price: {
          'VIP': 30000,
          'GOLD': 32000,
          'SILVER': 34000
        }
      }
    }
  },
  {
    id: 2,
    productId: 2,
    count: 1,
    variantId: null,
    variant: null,
    options: null,
    product: {
      id: 2,
      title: '모던 스톤웨어 접시 세트',
      config: {
        img_url: CART_PRODUCT_IMAGES.product2,
        default_price: 30000,
        discounted_price: 25500,
        stock_count: 5
      },
      optionJson: {
        level2_price: {
          'VIP': 24000,
          'GOLD': 25500,
          'SILVER': 27000
        }
      }
    }
  },
  {
    id: 3,
    productId: 3,
    count: 1,
    variantId: null,
    variant: null,
    options: null,
    product: {
      id: 3,
      title: '에코 우드 컵 4P 세트',
      config: {
        img_url: CART_PRODUCT_IMAGES.product3,
        default_price: 20000,
        discounted_price: 18000,
        stock_count: 8
      },
      optionJson: {
        level2_price: {
          'VIP': 16000,
          'GOLD': 18000,
          'SILVER': 19000
        }
      }
    }
  }
];

/**
 * CartSkin 컴포넌트 - 웹빌더 장바구니 스킨
 */
export const Cart: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  // 디버깅: 실제 전달되는 props 확인
  console.log('🔍 Cart Debug Info:', {
    dataKeys: Object.keys(data || {}),
    cartItemsLength: data?.cartItems?.length,
    cartItems: data?.cartItems,
    localQuantities: data?.localQuantities,
    actualLocalQuantities,
    isAdminMode: data?.isAdminMode,
    actionsKeys: Object.keys(actions || {}),
    hasIncreaseAction: typeof actions?.handleIncreaseQuantity === 'function',
    hasDecreaseAction: typeof actions?.handleDecreaseQuantity === 'function',
    optionsKeys: Object.keys(options || {}),
    mode: mode
  });

  // ✅ 새로운 문서에 맞게 데이터 추출
  const {
    cartItems = [],
    loading = false,
    calculations = {
      subtotal: 0,
      shippingFee: 0,
      total: 0
    },
    localQuantities = {},
    freeShippingLimit = 50000,
    user = { level: 'GOLD', levelName: '골드' },
    isUserLoggedIn = false,
    isAdminMode = false,
    theme = {}
  } = data || {};

  // 데이터 검증
  const validCartItems = cartItems.filter(item => {
    if (!item || typeof item !== 'object') {
      console.warn('Invalid cart item (not an object):', item);
      return false;
    }
    if (!item.id) {
      console.warn('Cart item missing id:', item);
      return false;
    }
    if (!item.product || typeof item.product !== 'object') {
      console.warn('Cart item missing product data:', item);
      return false;
    }
    return true;
  });

  // ✅ 새로운 문서에 맞게 actions 추출
  const {
    handleIncreaseQuantity = () => {},
    handleDecreaseQuantity = () => {},
    handleRemoveFromCart = () => Promise.resolve(),  // ⭐ handleRemoveItem → handleRemoveFromCart
    handleCheckout = () => {},
    handleClearCart = () => Promise.resolve(),
    calculateLevelPrice = (basePrice: number, product: any): PriceInfo => {
      // ⭐ 매개변수 다름: basePrice, product
      if (!product || typeof basePrice !== 'number') {
        console.warn('Invalid params for price calculation:', { basePrice, product });
        return {
          originalPrice: basePrice || 0,
          levelPrice: basePrice || 0,
          discount: 0,
          discountRate: 0,
          levelName: null
        };
      }
      
      const levelPrices = product.optionJson?.level2_price || {};
      const userLevel = user?.level || 'GOLD';
      const levelPrice = levelPrices[userLevel] || basePrice;
      const discount = Math.max(0, basePrice - levelPrice);
      const discountRate = basePrice > 0 ? Math.round((discount / basePrice) * 100) : 0;
      
      return {
        originalPrice: basePrice,
        levelPrice,
        discount,
        discountRate,
        levelName: user?.levelName || null
      };
    }
  } = actions || {};

  // ✅ 기본 스킨과 동일한 방식으로 utils 추출
  const {
    t = (key: string) => key,
    navigate = (path: string) => console.log(`Navigate to: ${path}`),
    formatCurrency = (amount: number) => `${amount.toLocaleString()}원`,
    cx = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')
  } = utils || {};

  // ✅ 기본 스킨과 동일한 방식으로 options 추출
  const {
    title = '장바구니',
    emptyText = '장바구니가 비어 있습니다.',
    showImage = true,
    showQuantitySelector = true,
    showRemoveButton = true,
    primaryButtonColor = '#007bff',
    priceColor = '#ff6b6b'
  } = options || {};

  // 관리자 모드일 때 더미 데이터 사용
  const actualCartItems = (isAdminMode && validCartItems.length === 0) ? DUMMY_CART_DATA : validCartItems;
  const actualCalculations = (isAdminMode && cartItems.length === 0) 
    ? { subtotal: 130000, shippingFee: 3000, total: 133000 }
    : calculations;
  const actualLocalQuantities = (isAdminMode && validCartItems.length === 0)
    ? DUMMY_CART_DATA.reduce((acc, item) => ({...acc, [String(item.id)]: item.count}), {})
    : localQuantities;

  // 로컬 수량 상태 관리 (즉시 UI 업데이트용)
  const [quantities, setQuantities] = React.useState<{[key: string]: number}>({});
  
  // localQuantities가 변경될 때 로컬 상태 업데이트
  React.useEffect(() => {
    if (actualLocalQuantities && Object.keys(actualLocalQuantities).length > 0) {
      setQuantities(actualLocalQuantities);
    }
  }, [actualLocalQuantities]);

  // 수량 증가 핸들러
  const handleQuantityIncrease = (item: CartItem) => {
    try {
      const itemId = String(item.id);
      const currentQuantity = quantities[itemId] || item.count || 1;
      const newQuantity = currentQuantity + 1;
      
      // 즉시 UI 업데이트
      setQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
      
      // 서버에 업데이트 (액션이 있는 경우에만)
      console.log('📍 Calling handleIncreaseQuantity with:', item);
      if (typeof handleIncreaseQuantity === 'function') {
        handleIncreaseQuantity(item);  // ⭐ item 객체 전체 전달
      } else {
        console.warn('handleIncreaseQuantity action not provided');
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  // 수량 감소 핸들러
  const handleQuantityDecrease = (item: CartItem) => {
    try {
      const itemId = String(item.id);
      const currentQuantity = quantities[itemId] || item.count || 1;
      if (currentQuantity <= 1) return;
      
      const newQuantity = currentQuantity - 1;
      
      // 즉시 UI 업데이트
      setQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
      
      // 서버에 업데이트 (액션이 있는 경우에만)
      console.log('📍 Calling handleDecreaseQuantity with:', item);
      if (typeof handleDecreaseQuantity === 'function') {
        handleDecreaseQuantity(item);  // ⭐ item 객체 전체 전달
      } else {
        console.warn('handleDecreaseQuantity action not provided');
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  // 직급별 가격 계산 헬퍼
  const getItemPriceInfo = (item: CartItem): PriceInfo => {
    const basePrice = item.product?.config?.discounted_price || item.product?.config?.default_price || 0;
    return calculateLevelPrice(basePrice, item.product);  // ⭐ basePrice, product 전달
  };

  // 무료배송 여부 확인
  const isEligibleForFreeShipping = actualCalculations.subtotal >= freeShippingLimit;
  const freeShippingRemaining = Math.max(0, freeShippingLimit - actualCalculations.subtotal);

  // 빈 장바구니 체크
  if (actualCartItems.length === 0) {
    return (
      <div className="cart-skin-cartContainer">
        <section className="cart-skin-globalWrapper cart-skin-w-full cart-skin-pt-8 cart-skin-md-py-10 cart-skin-flex cart-skin-flex-col cart-skin-items-center cart-skin-justify-center cart-skin-min-h-400">
          <h2 className="cart-skin-text-3xl cart-skin-font-serif cart-skin-mb-4">{title}</h2>
          <p className="cart-skin-text-black-60 cart-skin-mb-8">{emptyText}</p>
          <button 
            type="button" 
            className="cart-skin-flex cart-skin-items-center cart-skin-justify-center cart-skin-border cart-skin-hover-bg-primary-90 cart-skin-transition-colors cart-skin-bg-primary cart-skin-text-white cart-skin-border-primary cart-skin-hover-bg-primary-80 cart-skin-px-6 cart-skin-py-3"
            onClick={() => utils.navigate('/products')}
            style={{ backgroundColor: primaryButtonColor }}
          >
            쇼핑 계속하기
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="cart-skin-cartContainer">
      {/* 헤더 섹션 */}
      <section className="cart-skin-globalWrapper cart-skin-w-full cart-skin-pt-8 cart-skin-md-py-10 cart-skin-flex cart-skin-flex-col cart-skin-md-flex-row cart-skin-gap-10 cart-skin-items-center cart-skin-justify-between cart-skin-mb-5 cart-skin-md-mb-10">
        <div className="cart-skin-flex cart-skin-items-center cart-skin-gap-3 cart-skin-font-serif">
          <h2 className="cart-skin-text-3xl">{title}</h2>
          <p className="cart-skin-text-primary cart-skin-text-4xl">{actualCartItems.length}</p>
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

      {/* 사용자 등급 정보 */}
      {isUserLoggedIn && user?.levelName && (
        <section className="cart-skin-globalWrapper cart-skin-mb-4">
          <div className="cart-skin-flex cart-skin-items-center cart-skin-gap-2 cart-skin-text-sm cart-skin-text-primary">
            <span>현재 등급: {user.levelName}</span>
            {!isEligibleForFreeShipping && freeShippingRemaining > 0 && (
              <span className="cart-skin-text-black-60">
                • {formatCurrency(freeShippingRemaining)} 더 구매시 무료배송
              </span>
            )}
          </div>
        </section>
      )}

      {/* 메인 섹션 */}
      <section className="cart-skin-globalWrapper cart-skin-mb-20 cart-skin-relative cart-skin-flex cart-skin-flex-col cart-skin-md-flex-row cart-skin-items-start cart-skin-justify-between cart-skin-gap-5">
        {/* 상품 목록 */}
        <div className="cart-skin-flex-1 cart-skin-w-full cart-skin-border-t cart-skin-border-black">
          <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between cart-skin-py-4 cart-skin-gap-4">
            <div className="cart-skin-flex cart-skin-items-center cart-skin-gap-2">
              <span className="cart-skin-text-sm cart-skin-font-bold">상품 목록 ({actualCartItems.length}개)</span>
            </div>
            <button 
              type="button" 
              aria-label="장바구니 비우기" 
              className="cart-skin-text-sm cart-skin-underline cart-skin-hover-black-80 cart-skin-shrink-0"
              onClick={() => {
                if (typeof handleClearCart === 'function') {
                  handleClearCart();
                } else {
                  console.warn('handleClearCart action not provided');
                }
              }}
            >
              전체 삭제
            </button>
          </div>

          <div className="cart-skin-border-t cart-skin-border-black-10">
            <ul>
              {actualCartItems.map((item, index) => {
                if (!item || !item.id) {
                  console.error('Invalid cart item:', item);
                  return null;
                }
                
                const itemId = String(item.id);
                // localQuantities 우선, 그 다음 quantities, 마지막으로 item.count
                const quantity = actualLocalQuantities[item.id] || quantities[itemId] || item.count || 1;
                const priceInfo = getItemPriceInfo(item);
                const totalPrice = priceInfo.levelPrice * quantity;

                return (
                  <li key={itemId} className="cart-skin-flex cart-skin-gap-4 cart-skin-py-5 cart-skin-border-b cart-skin-border-black-10">
                    {showImage && (
                      <div className="cart-skin-w-75 cart-skin-md-w-120 cart-skin-h-75 cart-skin-md-h-120 cart-skin-aspect-square cart-skin-shrink-0">
                        <a href={`/products/${item.productId}`} data-discover="true">
                          <img 
                            alt={item.product.title} 
                            className="cart-skin-w-full cart-skin-h-full cart-skin-object-cover" 
                            src={item.product.config?.img_url || '/images/product-placeholder.png'} 
                            onError={(e: any) => {
                              e.target.src = '/images/product-placeholder.png';
                            }}
                          />
                        </a>
                      </div>
                    )}
                    <div className="cart-skin-flex-1 cart-skin-flex cart-skin-flex-col cart-skin-justify-between cart-skin-gap-2 cart-skin-md-gap-4">
                      <div className="cart-skin-flex cart-skin-items-start cart-skin-justify-between">
                        <div>
                          <h3 className="cart-skin-text-sm cart-skin-font-bold cart-skin-mb-2 cart-skin-line-clamp-1 cart-skin-md-line-clamp-2">{item.product.title}</h3>
                          
                          {/* 직급별 가격 정보 */}
                          {user?.levelName && (
                            <div className="cart-skin-text-xs cart-skin-text-primary cart-skin-mb-2">
                              {user.levelName} 등급 가격
                            </div>
                          )}
                          
                          {/* 옵션 정보 표시 */}
                          {item.variant?.options && (
                            <div className="cart-skin-text-xs cart-skin-text-black-60 cart-skin-mb-2">
                              {item.variant.options.map((opt: any) => (
                                <span key={opt.optionValueId} className="cart-skin-mr-2">
                                  {opt.optionValue.optionGroup.name}: {opt.optionValue.value}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="cart-skin-flex cart-skin-flex-wrap cart-skin-items-center cart-skin-gap-1-5">
                            {priceInfo.discountRate > 0 && (
                              <em className="cart-skin-text-xs cart-skin-text-primary cart-skin-font-bold cart-skin-bg-primary-10 cart-skin-px-1 cart-skin-py-0-5 cart-skin-rounded">{priceInfo.discountRate}%</em>
                            )}
                            <p className="cart-skin-font-bold">{formatCurrency(priceInfo.levelPrice)}</p>
                            {priceInfo.originalPrice > priceInfo.levelPrice && (
                              <del className="cart-skin-text-sm cart-skin-font-bold cart-skin-text-black-40 cart-skin-w-full cart-skin-md-w-auto cart-skin-mt-neg-0-5 cart-skin-md-mt-0">{formatCurrency(priceInfo.originalPrice)}</del>
                            )}
                          </div>
                        </div>
                        {showRemoveButton && (
                          <button 
                            type="button" 
                            aria-label="상품 삭제" 
                            className="cart-skin-p-2"
                            onClick={() => {
                              if (typeof handleRemoveFromCart === 'function') {
                                handleRemoveFromCart(item.id);  // ⭐ item.id만 전달
                              } else {
                                console.warn('handleRemoveFromCart action not provided');
                              }
                            }}
                          >
                            <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-skin-hover-primary">
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 8.939 6.11 5.05a.75.75 0 0 0-1.06 1.06L8.938 10 5.05 13.889a.75.75 0 0 0 1.06 1.06l8.84-8.838a.75.75 0 0 0-1.061-1.061L9.999 8.939Zm3.888 6.014-3.889-3.89 1.06-1.06 3.89 3.889a.75.75 0 0 1-1.061 1.06Z" fill="currentColor"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                        {showQuantitySelector ? (
                          <div className="cart-skin-quantity-container">
                            <button 
                              className="cart-skin-quantity-button" 
                              type="button"
                              onClick={() => handleQuantityDecrease(item)}
                              disabled={quantity <= 1}
                            >
                              <svg width="20px" height="20px" viewBox="0 0 21 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="cart-skin-w-12 cart-skin-h-12 cart-skin-text-black">
                                <rect x="2.25" y="10.75" width="1.5" height="16" rx="0.75" transform="rotate(-90 2.25 10.75)" fill="currentColor"></rect>
                              </svg>
                            </button>
                            <input readOnly className="cart-skin-quantity-input" value={quantity} />
                            <button 
                              className="cart-skin-quantity-button" 
                              type="button"
                              onClick={() => handleQuantityIncrease(item)}
                              disabled={item.product?.config?.stock_count && quantity >= item.product.config.stock_count}
                            >
                              <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-skin-w-12 cart-skin-h-12">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.238 2.75c.394 0 .714.336.714.75v5.75h5.476c.395 0 .714.336.714.75s-.32.75-.714.75h-5.476v5.75c0 .414-.32.75-.714.75-.395 0-.715-.336-.715-.75v-5.75H4.047c-.394 0-.714-.336-.714-.75s.32-.75.714-.75h5.476V3.5c0-.414.32-.75.715-.75Z" fill="currentColor"></path>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="cart-skin-text-sm">수량: {quantity}</span>
                        )}
                        <p className="cart-skin-font-bold">{formatCurrency(totalPrice)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-center cart-skin-p-4 cart-skin-bg-black-3 cart-skin-font-bold cart-skin-gap-1 cart-skin-text-xs">
              <p>상품 금액 : {formatCurrency(actualCalculations.subtotal)}</p>
              <p>/</p>
              <p>배송비 : {isEligibleForFreeShipping ? '무료' : formatCurrency(actualCalculations.shippingFee)}</p>
              {!isEligibleForFreeShipping && freeShippingRemaining > 0 && (
                <p className="cart-skin-text-primary">(주문 {formatCurrency(freeShippingRemaining)} 더 추가시 무료배송)</p>
              )}
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
                <span className="cart-skin-text-sm">{formatCurrency(actualCalculations.subtotal)}</span>
              </div>
              <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                <span className="cart-skin-text-sm">배송비</span>
                <span className="cart-skin-text-sm">{formatCurrency(actualCalculations.shippingFee)}</span>
              </div>
              <div className="cart-skin-totalPrice cart-skin-border-t cart-skin-border-black-10 cart-skin-pt-3">
                <div className="cart-skin-flex cart-skin-items-center cart-skin-justify-between">
                  <span className="cart-skin-font-bold">총 결제 금액</span>
                  <span className="cart-skin-font-bold cart-skin-text-lg" style={{ color: priceColor }}>{formatCurrency(actualCalculations.total)}</span>
                </div>
              </div>
            </div>
            <div className="cart-skin-mt-5">
              <button 
                type="button" 
                className="cart-skin-flex cart-skin-items-center cart-skin-justify-center cart-skin-border cart-skin-hover-bg-primary-90 cart-skin-transition-colors cart-skin-bg-primary cart-skin-text-white cart-skin-border-primary cart-skin-hover-bg-primary-80 cart-skin-w-full cart-skin-px-4-5 cart-skin-py-3-5"
                onClick={() => {
                  if (typeof handleCheckout === 'function') {
                    handleCheckout();
                  } else {
                    console.warn('handleCheckout action not provided');
                  }
                }}
                disabled={actualCartItems.length === 0 || loading}
                style={{ backgroundColor: primaryButtonColor }}
              >
                {loading ? '처리중...' : '주문하기'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(Cart as any).SAMPLE_DATA = DUMMY_CART_DATA;

export default Cart;