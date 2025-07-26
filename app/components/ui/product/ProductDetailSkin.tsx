import React from 'react';

// 스타일 import
import './product-detail-skin-scoped.css';

// Base64 이미지 import 제거 - 이제 API에서 이미지 데이터를 받아옴

// ProductDetail API 문서에 맞춘 ComponentSkinProps 인터페이스
interface ComponentSkinProps {
    data?: {
        // 기본 정보
        id?: string;
        style?: React.CSSProperties;
        componentProps?: {
            showDescriptionTab?: boolean;
            showReviewsTab?: boolean;
            showStock?: boolean;
            showRelatedProducts?: boolean;
            showQuantitySelector?: boolean;
            showAddToCart?: boolean;
            showBuyNow?: boolean;
            priceColor?: string;
            addToCartButtonColor?: string;
            buyNowButtonColor?: string;
            stockTextColor?: string;
        };
        
        // 상품 데이터
        product?: {
            id: number;
            title: string;
            name?: string;
            description?: string;
            markdown?: string;
            config: {
                img_url: string;
                main_image?: string;
                discounted_price: number;
                default_price: number;
                stock_count?: number;
            };
            shipping?: {
                type?: string;
                fee?: number;
                additionalInfo?: string;
            };
            additionalImages?: string[];
            reviews?: Array<{
                id: number;
                author: string;
                userName?: string;
                rating: number;
                content: string;
                date: string;
                createdAt?: string;
                images?: string[];
            }>;
            recentReviews?: Array<{
                id: number;
                userName: string;
                rating: number;
                content: string;
                createdAt: string;
            }>;
            totalReviews?: number;
            averageRating?: number;
        };
        
        // 가격 정보
        priceInfo?: {
            originalPrice: number;
            levelPrice: number;
            discount: number;
            discountRate: number;
            levelName?: string;
        };
        
        // 상태
        quantity?: number;
        currentImageIndex?: number;
        
        // 기타
        isUserLoggedIn?: boolean;
        isMobile?: boolean;
    };
    actions?: {
        handleQuantityChange?: (quantity: number) => void;
        handleAddToCart?: () => void;
        handleBuyNow?: () => void;
    };
    utils?: {
        t?: (key: string) => string;
        formatCurrency?: (amount: number) => string;
        formatDate?: (date: string | Date) => string;
    };
    mode?: 'editor' | 'preview' | 'production';
}

/**
 * ProductDetailSkin 컴포넌트 - 미니멀 디자인
 */
const ProductDetailSkin: React.FC<ComponentSkinProps> = (props = {}) => {
    const { 
        data = {}, 
        actions = {}, 
        utils = {}
    } = props;
    
    // 상태 관리
    const [quantity, setQuantity] = React.useState(data.quantity || 1);
    const [showStickyBar, setShowStickyBar] = React.useState(false);
    
    // 기본값 설정
    const product = data.product || {
        id: 1,
        title: '레고트 누프레임 커플잔 2P',
        config: {
            img_url: 'https://via.placeholder.com/600x600/f5f5f5/999?text=Product',
            discounted_price: 32000,
            default_price: 40000
        }
    };
    
    const componentProps = data.componentProps || {};
    const priceInfo = data.priceInfo || {
        originalPrice: product.config.default_price,
        levelPrice: product.config.discounted_price,
        discountRate: Math.round(((product.config.default_price - product.config.discounted_price) / product.config.default_price) * 100)
    };
    
    // 유틸리티
    const formatCurrency = utils.formatCurrency || ((amount: number) => `${amount.toLocaleString()}원`);
    const formatDate = utils.formatDate || ((date: string | Date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    
    // 상품 상세 이미지 추출 (description에서 - HTML과 마크다운 모두 지원)
    const extractImagesFromDescription = (description?: string): string[] => {
        if (!description) return [];
        const images: string[] = [];
        
        // HTML img 태그에서 src 추출
        const htmlRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = htmlRegex.exec(description)) !== null) {
            if (match[1] && !match[1].includes('ProseMirror-separator')) {
                images.push(match[1]);
            }
        }
        
        // 마크다운 이미지 문법에서 URL 추출 (하위 호환성)
        const markdownRegex = /!\[.*?\]\((.*?)\)/g;
        while ((match = markdownRegex.exec(description)) !== null) {
            if (match[1]) {
                images.push(match[1]);
            }
        }
        
        return images;
    };
    
    const detailImages = React.useMemo(() => {
        return extractImagesFromDescription(product.description);
    }, [product.description]);
    
    // 핸들러
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        actions.handleQuantityChange?.(newQuantity);
    };
    
    const handleAddToCart = () => {
        actions.handleAddToCart?.();
    };
    
    const handleBuyNow = () => {
        actions.handleBuyNow?.();
    };
    
    
    // 사용자명 마스킹 함수
    const maskUserName = (name: string): string => {
        if (!name || name.length <= 2) return name;
        const firstPart = name.substring(0, Math.ceil(name.length / 2));
        const maskedPart = '*'.repeat(name.length - firstPart.length);
        return firstPart + maskedPart;
    };
    
    // 리뷰 데이터 통합
    const reviews = React.useMemo(() => {
        return product.reviews || product.recentReviews || [];
    }, [product.reviews, product.recentReviews]);
    
    // 스크롤 이벤트 처리
    React.useEffect(() => {
        const handleScroll = () => {
            const productSection = document.querySelector('.pd-skin-product-section');
            if (productSection) {
                const rect = productSection.getBoundingClientRect();
                setShowStickyBar(rect.bottom < 0);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="pd-skin-container">
            {/* 상품 정보 섹션 */}
            <div className="pd-skin-product-section">
                {/* 왼쪽: 메인 이미지 */}
                <div className="pd-skin-image-area">
                    <img 
                        src={product.config.img_url || product.config.main_image} 
                        alt={product.title}
                        className="pd-skin-main-image"
                    />
                </div>
                
                {/* 오른쪽: 상품 정보 */}
                <div className="pd-skin-info-area">
                    <h1 className="pd-skin-title">{product.title}</h1>
                    
                    {/* 별점 */}
                    <div className="pd-skin-rating">
                        <span className="pd-skin-stars">
                            {product.averageRating ? '★'.repeat(Math.floor(product.averageRating)) + '☆'.repeat(5 - Math.floor(product.averageRating)) : '☆☆☆☆☆'}
                        </span>
                        <span className="pd-skin-rating-count">{product.totalReviews || 0}개 리뷰</span>
                    </div>
                    
                    {/* 가격 */}
                    <div className="pd-skin-price-area">
                        {priceInfo.discountRate > 0 && (
                            <div className="pd-skin-discount-info">
                                <span className="pd-skin-discount-rate">{priceInfo.discountRate}%</span>
                                <span className="pd-skin-original-price">{formatCurrency(priceInfo.originalPrice)}</span>
                            </div>
                        )}
                        <div className="pd-skin-current-price">{formatCurrency(priceInfo.levelPrice)}</div>
                    </div>
                    
                    {/* 배송비 */}
                    <div className="pd-skin-delivery-info">
                        <div className="pd-skin-delivery-item">
                            <span className="pd-skin-label">배송비</span>
                            <span className="pd-skin-value">
                                {product.shipping?.fee ? formatCurrency(product.shipping.fee) : '3,000원'}
                            </span>
                        </div>
                        <div className="pd-skin-delivery-note">
                            제주 및 도서 산간 배송비 추가 <span className="pd-skin-info-icon">ⓘ</span>
                        </div>
                    </div>
                    
                    {/* 상품명/수량 */}
                    <div className="pd-skin-product-name">{product.title}</div>
                    
                    {/* 수량 선택 */}
                    {componentProps.showQuantitySelector !== false && (
                        <div className="pd-skin-quantity-area">
                            <button 
                                className="pd-skin-quantity-btn"
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="pd-skin-quantity-value">{quantity}</span>
                            <button 
                                className="pd-skin-quantity-btn"
                                onClick={() => handleQuantityChange(quantity + 1)}
                            >
                                +
                            </button>
                            <span className="pd-skin-quantity-price">
                                {formatCurrency(priceInfo.levelPrice * quantity)}
                            </span>
                        </div>
                    )}
                    
                    {/* 총 상품 금액 */}
                    <div className="pd-skin-total-area">
                        <span className="pd-skin-total-label">총 상품 금액 {quantity}개</span>
                        <span className="pd-skin-total-price">{formatCurrency(priceInfo.levelPrice * quantity)}</span>
                    </div>
                    
                    {/* 버튼 */}
                    <div className="pd-skin-buttons">
                        {componentProps.showAddToCart !== false && (
                            <button 
                                className="pd-skin-btn-cart"
                                onClick={handleAddToCart}
                                style={componentProps.addToCartButtonColor ? { borderColor: componentProps.addToCartButtonColor, color: componentProps.addToCartButtonColor } : {}}
                            >
                                장바구니
                            </button>
                        )}
                        {componentProps.showBuyNow !== false && (
                            <button 
                                className="pd-skin-btn-buy"
                                onClick={handleBuyNow}
                                style={componentProps.buyNowButtonColor ? { backgroundColor: componentProps.buyNowButtonColor } : {}}
                            >
                                바로구매
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* 상품 상세 이미지 섹션 */}
            <div className="pd-skin-detail-section">
                {detailImages.length > 0 ? (
                    <div className="pd-skin-detail-images">
                        {detailImages.map((image, index) => (
                            <img 
                                key={index}
                                src={image}
                                alt={`상품 상세 이미지 ${index + 1}`}
                                className="pd-skin-detail-image"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="pd-skin-detail-images">
                        <img 
                            src="/images/product-detail.png"
                            alt="상품 상세 이미지"
                            className="pd-skin-detail-image"
                        />
                    </div>
                )}
            </div>
            
            {/* 리뷰 섹션 (상품 상세 이미지 하단) */}
            {componentProps.showReviewsTab !== false && (
                <section className="pd-skin-productReviewContainer pd-skin-globalWrapper pd-skin-w-full pd-skin-py-8 pd-skin-md-py-10">
                    <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-3 pd-skin-md-gap-4 pd-skin-font-serif pd-skin-text-2xl pd-skin-mb-3">
                        <h2>리뷰 ({product.totalReviews || reviews.length})</h2>
                        <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-1">
                            <svg width="20px" height="20px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="pd-skin-hover-primary pd-skin-w-24 pd-skin-md-w-27 pd-skin-h-24 pd-skin-md-h-27 pd-skin-text-black pd-skin-hover-black">
                                <path d="M22.991 5.425a1.126 1.126 0 0 1 2.02 0L30.36 16.26c.164.332.481.563.848.616l11.959 1.738a1.126 1.126 0 0 1 .624 1.92l-8.654 8.436a1.127 1.127 0 0 0-.323.997l2.042 11.91a1.126 1.126 0 0 1-1.634 1.187l-10.696-5.623a1.126 1.126 0 0 0-1.048 0l-10.696 5.623a1.126 1.126 0 0 1-1.634-1.187l2.043-11.91a1.126 1.126 0 0 0-.324-.997l-8.654-8.435a1.126 1.126 0 0 1 .625-1.921l11.958-1.738c.367-.053.684-.284.848-.616l5.348-10.836Z" fill="currentColor"></path>
                            </svg>
                            <p className="pd-skin-md-mt-1">{product.averageRating ? product.averageRating.toFixed(1) : '0.0'}</p>
                        </div>
                    </div>
                    <div className="pd-skin-reviewList pd-skin-border-t pd-skin-border-black">
                        <div className="pd-skin-py-3">
                            <ul className="pd-skin-flex pd-skin-items-center pd-skin-gap-4">
                                <li>
                                    <input type="radio" id="sortByRatingDesc" className="pd-skin-hidden pd-skin-peer" name="sort" defaultChecked />
                                    <label htmlFor="sortByRatingDesc" className="pd-skin-text-sm pd-skin-cursor-pointer pd-skin-text-black-40 pd-skin-peer-checked-text-black">별점 높은순</label>
                                </li>
                                <li>
                                    <input type="radio" id="sortByRatingAsc" className="pd-skin-hidden pd-skin-peer" name="sort" />
                                    <label htmlFor="sortByRatingAsc" className="pd-skin-text-sm pd-skin-cursor-pointer pd-skin-text-black-40 pd-skin-peer-checked-text-black">별점 낮은순</label>
                                </li>
                                <li>
                                    <input type="radio" id="sortByLatest" className="pd-skin-hidden pd-skin-peer" name="sort" />
                                    <label htmlFor="sortByLatest" className="pd-skin-text-sm pd-skin-cursor-pointer pd-skin-text-black-40 pd-skin-peer-checked-text-black">최신순</label>
                                </li>
                            </ul>
                        </div>
                        <div className="pd-skin-border-t pd-skin-border-black-10">
                    
                            {reviews.length > 0 ? (
                                <ul>
                                    {reviews.map((review) => (
                                        <li key={review.id} className="pd-skin-reviewItem pd-skin-opacity-0">
                                            {/* 상품 정보 영역 */}
                                            <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-4 pd-skin-py-4 pd-skin-border-b pd-skin-border-black-10">
                                                <div className="pd-skin-w-50 pd-skin-md-w-70 pd-skin-h-50 pd-skin-md-h-70 pd-skin-shrink-0">
                                                    <a href="#" data-discover="true">
                                                        <img 
                                                            src={product.config.img_url} 
                                                            alt={product.title}
                                                            className="pd-skin-w-full pd-skin-h-full pd-skin-object-cover"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="pd-skin-space-y-1 pd-skin-md-space-y-2">
                                                    <h3 className="pd-skin-text-sm pd-skin-font-bold">{product.title}</h3>
                                                    <p className="pd-skin-text-sm pd-skin-text-black-60">옵션 : 내추럴</p>
                                                </div>
                                            </div>
                                            
                                            {/* 리뷰 영역 */}
                                            <div className="pd-skin-py-4 pd-skin-border-b pd-skin-border-black-10">
                                                <div></div>
                                                <div className="pd-skin-flex pd-skin-items-center pd-skin-justify-between pd-skin-my-2">
                                                    <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-2">
                                                        <div className="pd-skin-flex pd-skin-items-center">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <svg 
                                                                    key={star}
                                                                    width="20px" 
                                                                    height="20px" 
                                                                    viewBox="0 0 48 48" 
                                                                    fill="none" 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    className={`pd-skin-hover-primary pd-skin-w-14 pd-skin-md-w-auto pd-skin-h-14 pd-skin-md-h-auto ${star <= review.rating ? 'pd-skin-text-black pd-skin-hover-black' : 'pd-skin-text-black-20 pd-skin-hover-black-20'}`}
                                                                >
                                                                    <path d="M22.991 5.425a1.126 1.126 0 0 1 2.02 0L30.36 16.26c.164.332.481.563.848.616l11.959 1.738a1.126 1.126 0 0 1 .624 1.92l-8.654 8.436a1.127 1.127 0 0 0-.323.997l2.042 11.91a1.126 1.126 0 0 1-1.634 1.187l-10.696-5.623a1.126 1.126 0 0 0-1.048 0l-10.696 5.623a1.126 1.126 0 0 1-1.634-1.187l2.043-11.91a1.126 1.126 0 0 0-.324-.997l-8.654-8.435a1.126 1.126 0 0 1 .625-1.921l11.958-1.738c.367-.053.684-.284.848-.616l5.348-10.836Z" fill="currentColor"></path>
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <p className="pd-skin-text-sm pd-skin-text-black-80">{maskUserName((review as any).author || (review as any).userName)}</p>
                                                    </div>
                                                    <p className="pd-skin-text-xs pd-skin-text-black-80">{formatDate((review as any).date || (review as any).createdAt || new Date())}</p>
                                                </div>
                                                <div className={`pd-skin-flex pd-skin-items-start pd-skin-pt-1 pd-skin-md-pt-3 pd-skin-mb-2 pd-skin-gap-4 pd-skin-transition-all pd-skin-duration-300 ${(review as any).images && (review as any).images.length > 0 ? 'pd-skin-justify-between' : ''}`}>
                                                    <p className="pd-skin-text-sm">{review.content}</p>
                                                    {(review as any).images && (review as any).images.length > 0 && (
                                                        <button 
                                                            className="pd-skin-object-cover pd-skin-transition-opacity pd-skin-duration-300 pd-skin-hover-opacity-80 pd-skin-aspect-1 pd-skin-w-75 pd-skin-md-w-94 pd-skin-h-75 pd-skin-md-h-94"
                                                            type="button"
                                                        >
                                                            <img 
                                                                src={(review as any).images[0]} 
                                                                alt={product.title}
                                                                className="pd-skin-w-full pd-skin-h-full pd-skin-object-cover"
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="pd-skin-empty-reviews">
                                    아직 작성된 리뷰가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
            
            {/* 하단 고정 구매 바 */}
            {showStickyBar && (
                <div className="pd-skin-sticky-bar">
                    <div className="pd-skin-sticky-content">
                        <div className="pd-skin-sticky-info">
                            <img 
                                src={product.config.img_url} 
                                alt={product.title}
                                className="pd-skin-sticky-image"
                            />
                            <div className="pd-skin-sticky-details">
                                <div className="pd-skin-sticky-title">{product.title}</div>
                                <div className="pd-skin-sticky-price">
                                    {priceInfo.discountRate > 0 && (
                                        <span className="pd-skin-sticky-discount">{priceInfo.discountRate}%</span>
                                    )}
                                    <span className="pd-skin-sticky-current-price">{formatCurrency(priceInfo.levelPrice)}</span>
                                    {priceInfo.discountRate > 0 && (
                                        <span className="pd-skin-sticky-original-price">{formatCurrency(priceInfo.originalPrice)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button 
                            className="pd-skin-sticky-buy-btn"
                            onClick={handleBuyNow}
                        >
                            구매하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailSkin;