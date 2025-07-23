import React from 'react';

// 스타일 import
import './product-detail-skin-scoped.css';

// Base64 이미지 import
import { PRODUCT_DETAIL_IMAGES } from './product-detail-images';

// Mock 데이터 (번들에 포함)
const PRODUCT_DETAIL_DATA = {
    product: {
        id: 9,
        name: '미니멀 글라스 텀블러 6P',
        price: 27600,
        originalPrice: 30000,
        discount: 8,
        rating: 4.1,
        reviewCount: 75,
        image: PRODUCT_DETAIL_IMAGES.product1,
        detailImage: PRODUCT_DETAIL_IMAGES.productDetail,
        shipping: {
            type: '택배',
            fee: 3000,
            additionalInfo: '제주 및 도서 산간 배송비 추가'
        },
        quantity: 0,
        totalPrice: 0
    },
    reviews: [
        {
            id: 1,
            productName: '미니멀 글라스 텀블러 6P',
            option: '클리어',
            rating: 4,
            author: 'm*********n',
            date: '2024-02-14',
            content: '심플하고 깔끔해서 어떤 음료를 마셔도 잘 어울려요. 6개 세트라 좋아요.',
            image: PRODUCT_DETAIL_IMAGES.reviewImage,
            productImage: PRODUCT_DETAIL_IMAGES.product4
        }
    ]
};

/**
 * ProductDetailSkin 컴포넌트 - 상품 상세 페이지 통합 UMD 버전
 *
 * 기능:
 * - 상품 정보 섹션 (이미지, 가격, 옵션, 장바구니)
 * - 상품 상세 이미지 섹션
 * - 리뷰 섹션 (평점, 정렬, 리뷰 목록)
 * - 완전히 독립적인 컴포넌트 (props 없음)
 */
export function ProductDetail() {
    const [quantity, setQuantity] = React.useState(0);
    const [sortType, setSortType] = React.useState('sortByRatingDesc');

    const handleQuantityChange = (delta: number) => {
        const newQuantity = Math.max(0, quantity + delta);
        setQuantity(newQuantity);
    };

    const totalPrice = quantity * PRODUCT_DETAIL_DATA.product.price;

    // 별점 아이콘 렌더링
    const renderStars = (rating: number, size: string = 'w-[12px] h-[12px]') => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    width="20px"
                    height="20px"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`pd-skin-hover-primary ${size} ${i <= Math.floor(rating) ? 'pd-skin-text-primary' : 'pd-skin-text-black-20'}`}
                >
                    <path
                        d="M22.991 5.425a1.126 1.126 0 0 1 2.02 0L30.36 16.26c.164.332.481.563.848.616l11.959 1.738a1.126 1.126 0 0 1 .624 1.92l-8.654 8.436a1.127 1.127 0 0 0-.323.997l2.042 11.91a1.126 1.126 0 0 1-1.634 1.187l-10.696-5.623a1.126 1.126 0 0 0-1.048 0l-10.696 5.623a1.126 1.126 0 0 1-1.634-1.187l2.043-11.91a1.126 1.126 0 0 0-.324-.997l-8.654-8.435a1.126 1.126 0 0 1 .625-1.921l11.958-1.738c.367-.053.684-.284.848-.616l5.348-10.836Z"
                        fill="currentColor"
                    />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="pd-skin-productContainer pd-skin-opacity-0" style={{ opacity: 1 }}>
            {/* 상품 정보 섹션 */}
            <section className="pd-skin-productInfoContainer pd-skin-globalWrapper pd-skin-w-full pd-skin-py-5 pd-skin-md-py-15">
                <div className="pd-skin-flex pd-skin-flex-col pd-skin-md-flex-row pd-skin-items-center pd-skin-md-items-start pd-skin-justify-between pd-skin-gap-7 pd-skin-md-gap-60">
                    {/* 상품 이미지 */}
                    <div className="pd-skin-aspect-square pd-skin-h-full pd-skin-w-full pd-skin-md-max-w-46">
                        <img
                            alt={PRODUCT_DETAIL_DATA.product.name}
                            className="pd-skin-w-full pd-skin-h-full pd-skin-object-cover"
                            src={PRODUCT_DETAIL_DATA.product.image}
                        />
                    </div>

                    {/* 상품 정보 */}
                    <div className="pd-skin-h-full pd-skin-w-full pd-skin-px-5 pd-skin-md-px-10">
                        <h2 className="pd-skin-font-serif pd-skin-text-2xl">{PRODUCT_DETAIL_DATA.product.name}</h2>
                        
                        {/* 평점 및 리뷰 */}
                        <div className="pd-skin-border-b pd-skin-border-black-10 pd-skin-py-4">
                            <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-1">
                                {renderStars(PRODUCT_DETAIL_DATA.product.rating)}
                                <p className="pd-skin-text-xs pd-skin-font-bold pd-skin-text-primary">{PRODUCT_DETAIL_DATA.product.rating}</p>
                                <button className="pd-skin-text-xs pd-skin-text-black-60 pd-skin-underline" type="button" aria-label="리뷰">
                                    {PRODUCT_DETAIL_DATA.product.reviewCount}개 리뷰
                                </button>
                            </div>
                            
                            {/* 가격 정보 */}
                            <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-1-5 pd-skin-mt-3">
                                <div className="pd-skin-flex pd-skin-flex-wrap pd-skin-items-center pd-skin-gap-1-5">
                                    <em className="pd-skin-text-xs pd-skin-text-primary pd-skin-font-bold pd-skin-bg-primary-10 pd-skin-px-1 pd-skin-py-0-5 pd-skin-rounded">{PRODUCT_DETAIL_DATA.product.discount}%</em>
                                    <p className="pd-skin-font-bold">{PRODUCT_DETAIL_DATA.product.price.toLocaleString()}원</p>
                                    <del className="pd-skin-text-sm pd-skin-font-bold pd-skin-text-black-40 pd-skin-w-auto">{PRODUCT_DETAIL_DATA.product.originalPrice.toLocaleString()}원</del>
                                </div>
                                <div className="pd-skin-relative">
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="pd-skin-hover-primary">
                                        <g clipPath="url(#icon-info-svg)" fill="currentColor">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M3.5 10a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" fill="currentColor"/>
                                            <path d="M9.106 11.52v.097h1.262v-.097c.01-.808.27-1.18.895-1.563.7-.415 1.137-.987 1.143-1.865C12.4 6.809 11.403 6 9.947 6c-1.331 0-2.41.739-2.447 2.189h1.348c.037-.723.555-1.068 1.089-1.068.587 0 1.062.388 1.056.992.006.54-.35.9-.808 1.197-.68.415-1.068.836-1.079 2.21Zm-.172 1.639a.839.839 0 0 0 .84.841c.448 0 .831-.377.831-.841a.845.845 0 0 0-.83-.83c-.464.005-.846.377-.841.83Z" fill="currentColor"/>
                                        </g>
                                        <defs fill="currentColor">
                                            <clipPath id="icon-info-svg" fill="currentColor">
                                                <path transform="translate(2 2)" d="M0 0h16v16H0z" fill="currentColor"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 배송 정보 */}
                        <div className="pd-skin-border-b pd-skin-border-black-10 pd-skin-py-4">
                            <div className="pd-skin-flex pd-skin-items-start pd-skin-gap-3">
                                <p className="pd-skin-text-sm pd-skin-w-84 pd-skin-shrink-0">배송비</p>
                                <div className="pd-skin-flex pd-skin-flex-col pd-skin-gap-1-5">
                                    <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-1 pd-skin-text-sm">
                                        <p>{PRODUCT_DETAIL_DATA.product.shipping.type}</p>
                                        <span className="pd-skin-w-1px pd-skin-h-14 pd-skin-mx-1 pd-skin-bg-black-20"></span>
                                        <p className="pd-skin-text-primary">{PRODUCT_DETAIL_DATA.product.shipping.fee.toLocaleString()}원</p>
                                    </div>
                                    <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-1 pd-skin-text-sm">
                                        <p>{PRODUCT_DETAIL_DATA.product.shipping.additionalInfo}</p>
                                        <div className="pd-skin-relative">
                                            <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="pd-skin-hover-primary">
                                                <g clipPath="url(#icon-info-svg)" fill="currentColor">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.5 10a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" fill="currentColor"/>
                                                    <path d="M9.106 11.52v.097h1.262v-.097c.01-.808.27-1.18.895-1.563.7-.415 1.137-.987 1.143-1.865C12.4 6.809 11.403 6 9.947 6c-1.331 0-2.41.739-2.447 2.189h1.348c.037-.723.555-1.068 1.089-1.068.587 0 1.062.388 1.056.992.006.54-.35.9-.808 1.197-.68.415-1.068.836-1.079 2.21Zm-.172 1.639a.839.839 0 0 0 .84.841c.448 0 .831-.377.831-.841a.845.845 0 0 0-.83-.83c-.464.005-.846.377-.841.83Z" fill="currentColor"/>
                                                </g>
                                                <defs fill="currentColor">
                                                    <clipPath id="icon-info-svg" fill="currentColor">
                                                        <path transform="translate(2 2)" d="M0 0h16v16H0z" fill="currentColor"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 수량 선택 */}
                        <div className="pd-skin-border-b pd-skin-border-black-10 pd-skin-py-4">
                            <div className="pd-skin-p-5 pd-skin-bg-black-3">
                                <p className="pd-skin-text-sm">{PRODUCT_DETAIL_DATA.product.name}</p>
                                <div className="pd-skin-flex pd-skin-items-center pd-skin-justify-between pd-skin-mt-4">
                                    <div className="pd-skin-flex pd-skin-items-center">
                                        <button
                                            className={`pd-skin-flex pd-skin-items-center pd-skin-justify-center pd-skin-p-1-5 pd-skin-bg-transparent pd-skin-border pd-skin-border-black-10 ${quantity <= 0 ? 'pd-skin-cursor-not-allowed' : ''}`}
                                            type="button"
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 0}
                                        >
                                            <svg width="20px" height="20px" viewBox="0 0 21 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={`pd-skin-hover-primary pd-skin-w-12 pd-skin-h-12 ${quantity <= 0 ? 'pd-skin-text-black-40' : ''}`}>
                                                <rect x="2.25" y="10.75" width="1.5" height="16" rx="0.75" transform="rotate(-90 2.25 10.75)" fill="currentColor"/>
                                            </svg>
                                        </button>
                                        <input
                                            readOnly
                                            className="pd-skin-text-center pd-skin-text-sm pd-skin-w-50"
                                            value={quantity}
                                        />
                                        <button
                                            className="pd-skin-border-black-20 pd-skin-flex pd-skin-items-center pd-skin-justify-center pd-skin-p-1-5 pd-skin-bg-transparent pd-skin-border"
                                            type="button"
                                            onClick={() => handleQuantityChange(1)}
                                        >
                                            <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="pd-skin-hover-primary pd-skin-w-12 pd-skin-h-12">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.238 2.75c.394 0 .714.336.714.75v5.75h5.476c.395 0 .714.336.714.75s-.32.75-.714.75h-5.476v5.75c0 .414-.32.75-.714.75-.395 0-.715-.336-.715-.75v-5.75H4.047c-.394 0-.714-.336-.714-.75s.32-.75.714-.75h5.476V3.5c0-.414.32-.75.715-.75Z" fill="currentColor"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="pd-skin-text-sm">{PRODUCT_DETAIL_DATA.product.price.toLocaleString()}원</p>
                                </div>
                            </div>
                        </div>

                        {/* 총 금액 */}
                        <div className="pd-skin-py-4">
                            <div className="pd-skin-flex pd-skin-items-center pd-skin-justify-between">
                                <p className="pd-skin-text-sm">총 상품 금액 {quantity}개</p>
                                <p className="pd-skin-font-bold">{totalPrice.toLocaleString()}원</p>
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="pd-skin-mt-4">
                            <div className="pd-skin-flex pd-skin-items-center pd-skin-justify-between pd-skin-gap-4">
                                <button
                                    type="button"
                                    aria-label="장바구니"
                                    className="pd-skin-flex pd-skin-items-center pd-skin-justify-center pd-skin-border pd-skin-hover-bg-primary-90 pd-skin-transition-colors pd-skin-bg-white pd-skin-text-primary pd-skin-border-primary pd-skin-hover-bg-primary-10 pd-skin-w-full pd-skin-p-3 pd-skin-md-p-5 pd-skin-text-sm pd-skin-md-text-base"
                                >
                                    장바구니
                                </button>
                                <a
                                    className="pd-skin-flex pd-skin-items-center pd-skin-justify-center pd-skin-border pd-skin-hover-bg-primary-90 pd-skin-transition-colors pd-skin-bg-primary pd-skin-text-white pd-skin-border-primary pd-skin-hover-bg-primary-80 pd-skin-w-full pd-skin-p-3 pd-skin-md-p-5 pd-skin-text-sm pd-skin-md-text-base"
                                    href="/order"
                                    data-discover="true"
                                >
                                    바로구매
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 상품 상세 이미지 섹션 */}
            <section className="pd-skin-productDetailContainer pd-skin-globalWrapper pd-skin-w-full pd-skin-py-5 pd-skin-md-py-10">
                <div className="pd-skin-border-y pd-skin-border-black-20 pd-skin-py-8 pd-skin-md-py-10">
                    <img
                        alt="상품 상세 이미지"
                        className="pd-skin-mx-auto"
                        src={PRODUCT_DETAIL_DATA.product.detailImage}
                    />
                </div>
            </section>

            {/* 리뷰 섹션 */}
            <section className="pd-skin-productReviewContainer pd-skin-globalWrapper pd-skin-w-full pd-skin-py-8 pd-skin-md-py-10">
                <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-3 pd-skin-md-gap-4 pd-skin-font-serif pd-skin-text-2xl pd-skin-mb-3">
                    <h2>리뷰 ({PRODUCT_DETAIL_DATA.reviews.length})</h2>
                    <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-1">
                        {renderStars(PRODUCT_DETAIL_DATA.product.rating, 'pd-skin-w-24 pd-skin-md-w-27 pd-skin-h-24 pd-skin-md-h-27')}
                        <p className="pd-skin--md-0-5 pd-skin-md--mt-1">{PRODUCT_DETAIL_DATA.product.rating}</p>
                    </div>
                </div>

                <div className="pd-skin-reviewList pd-skin-border-t pd-skin-border-black">
                    {/* 정렬 옵션 */}
                    <div className="pd-skin-py-3">
                        <ul className="pd-skin-flex pd-skin-items-center pd-skin-gap-4">
                            <li>
                                <input
                                    id="sortByRatingDesc"
                                    className="pd-skin-hidden pd-skin-peer"
                                    type="radio"
                                    checked={sortType === 'sortByRatingDesc'}
                                    name="sort"
                                    onChange={() => setSortType('sortByRatingDesc')}
                                />
                                <label htmlFor="sortByRatingDesc" className="pd-skin-text-sm pd-skin-cursor-pointer pd-skin-text-black-40 pd-skin-peer-checked-text-black">
                                    별점 높은순
                                </label>
                            </li>
                            <li>
                                <input
                                    id="sortByRatingAsc"
                                    className="pd-skin-hidden pd-skin-peer"
                                    type="radio"
                                    checked={sortType === 'sortByRatingAsc'}
                                    name="sort"
                                    onChange={() => setSortType('sortByRatingAsc')}
                                />
                                <label htmlFor="sortByRatingAsc" className="pd-skin-text-sm pd-skin-cursor-pointer pd-skin-text-black-40 pd-skin-peer-checked-text-black">
                                    별점 낮은순
                                </label>
                            </li>
                            <li>
                                <input
                                    id="sortByLatest"
                                    className="pd-skin-hidden pd-skin-peer"
                                    type="radio"
                                    checked={sortType === 'sortByLatest'}
                                    name="sort"
                                    onChange={() => setSortType('sortByLatest')}
                                />
                                <label htmlFor="sortByLatest" className="pd-skin-text-sm pd-skin-cursor-pointer pd-skin-text-black-40 pd-skin-peer-checked-text-black">
                                    최신순
                                </label>
                            </li>
                        </ul>
                    </div>

                    {/* 리뷰 목록 */}
                    <div className="pd-skin-border-t pd-skin-border-black-10">
                        <ul>
                            {PRODUCT_DETAIL_DATA.reviews.map((review) => (
                                <li key={review.id} className="pd-skin-reviewItem pd-skin-opacity-0" style={{ opacity: 1 }}>
                                    {/* 상품 정보 */}
                                    <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-4 pd-skin-py-4 pd-skin-border-b pd-skin-border-black-10">
                                        <div className="pd-skin-w-50 pd-skin-md-w-70 pd-skin-h-50 pd-skin-md-h-70 pd-skin-shrink-0">
                                            <a href={`/products/${PRODUCT_DETAIL_DATA.product.id}`} data-discover="true">
                                                <img
                                                    alt={review.productName}
                                                    className="pd-skin-w-full pd-skin-h-full pd-skin-object-cover"
                                                    src={review.productImage}
                                                />
                                            </a>
                                        </div>
                                        <div className="pd-skin-space-y-1 pd-skin-md-space-y-2">
                                            <h3 className="pd-skin-text-sm pd-skin-font-bold">{review.productName}</h3>
                                            <p className="pd-skin-text-sm pd-skin-text-black-60">옵션 : {review.option}</p>
                                        </div>
                                    </div>

                                    {/* 리뷰 내용 */}
                                    <div className="pd-skin-py-4 pd-skin-border-b pd-skin-border-black-10">
                                        <div></div>
                                        <div className="pd-skin-flex pd-skin-items-center pd-skin-justify-between pd-skin-my-2">
                                            <div className="pd-skin-flex pd-skin-items-center pd-skin-gap-2">
                                                <div className="pd-skin-flex pd-skin-items-center">
                                                    {renderStars(review.rating, 'pd-skin-w-14 pd-skin-md-w-auto pd-skin-h-14 pd-skin-md-h-auto')}
                                                </div>
                                                <p className="pd-skin-text-sm pd-skin-text-black-80">{review.author}</p>
                                            </div>
                                            <p className="pd-skin-text-xs pd-skin-text-black-80">{review.date}</p>
                                        </div>
                                        <div className="pd-skin-flex pd-skin-items-start pd-skin-pt-1 pd-skin-md-pt-3 pd-skin-mb-2 pd-skin-gap-4 pd-skin-transition-all pd-skin-duration-300 pd-skin-justify-between">
                                            <p className="pd-skin-text-sm">{review.content}</p>
                                            <button
                                                className="pd-skin-object-cover pd-skin-transition-opacity pd-skin-duration-300 pd-skin-hover-opacity-80 pd-skin-aspect-1-1 pd-skin-w-75 pd-skin-md-w-94 pd-skin-h-75 pd-skin-md-h-94"
                                                type="button"
                                            >
                                                <img
                                                    alt={review.productName}
                                                    className="pd-skin-w-full pd-skin-h-full pd-skin-object-cover"
                                                    src={review.image}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(ProductDetail as any).SAMPLE_DATA = PRODUCT_DETAIL_DATA;

export default ProductDetail;