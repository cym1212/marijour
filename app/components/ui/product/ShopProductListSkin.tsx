import React from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SkinProps } from '@withcookie/webbuilder-sdk';
import { CartIcon, DubbleArrowIcon, ArrowIcon } from '@/components/icons';
import { ReviewScore } from '@/components/ui/product/ReviewScore';
import { ProductPrice } from '@/components/ui/product/ProductPrice';
import { CartButton } from '@/components/ui/button/CartButton';
import { TextBadge } from '@/components/ui/Badge';
import { NoData } from '../NoData';
import { ProductIcon } from '@/components/icons';
import './shop-product-list-skin.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Product {
  id: number | string;
  title: string;
  description?: string;
  image?: string;
  imageTwo?: string;
  oldPrice: number;
  newPrice: number;
  sale?: string;
  isInStock?: boolean;
  stockCount?: number;
  rating?: number;
  companyId?: number;
  hasOptions?: boolean;
  reviewCount?: number;
  badges?: string[];
  config?: {
    default_price?: string | number;
    discounted_price?: string | number;
    system_price?: string | number;
    stock_count?: string | number;
    [key: string]: any;
  };
  name?: string;
  price?: number;
  originalPrice?: number;
  thumbnail?: string;
  created_at?: string;
  category_id?: string | number;
  variant_id?: string | number;
  stock?: number;
  [key: string]: any;
}

const ShopProductListSkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app 
}) => {
  const { t } = utils;
  
  // 데이터 추출
  const products = data.products || [];
  const loading = data.loading || false;
  const totalProducts = data.totalProducts || products.length;
  const currentPage = data.currentPage || 1;
  const totalPages = data.totalPages || 1;
  const isMobile = data.isMobile || false;
  const isLoadingMore = data.isLoadingMore || false;
  const mobilePage = data.mobilePage || 1;
  const mobileProducts = data.mobileProducts || products;
  
  // 액션 사용
  const { handleAddToCart, handleProductClick, handlePageChange, handleLoadMore } = actions;

  // GSAP 애니메이션
  useGSAP(() => {
    gsap.to('.shopContainer', {
      opacity: 1,
      duration: 0.9,
      ease: 'power2.out',
    });
  });

  useGSAP(() => {
    const productItems = gsap.utils.toArray('.productsContainer .productItem') as Element[];

    if (productItems.length === 0) return;

    ScrollTrigger.batch(productItems, {
      start: 'top 95%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power2.out',
        }),
    });
  }, [products]);

  if (loading) {
    return <div className="loading-spinner text-center py-10">{t('로딩 중...')}</div>;
  }

  // 모바일 여부에 따른 상품 목록 선택
  const displayProducts = isMobile ? mobileProducts : products;

  return (
    <div className="shopContainer">
      {displayProducts.length > 0 ? (
        <>
        
          <section className="productsContainer globalWrapper w-full pb-5 md:pb-10 mb-5 md:mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-10 md:gap-y-15">
              {displayProducts.map((product: Product) => {
                // 가이드 문서의 Product 인터페이스에 맞게 데이터 변환
                const productData = {
                  id: product.id,
                  name: product.title || product.name || '',
                  discountRate: product.oldPrice && product.newPrice < product.oldPrice 
                    ? Math.round((1 - product.newPrice / product.oldPrice) * 100) 
                    : 0,
                  price: product.newPrice || product.price || 0,
                  originalPrice: product.oldPrice || product.originalPrice || 0,
                  starRating: product.rating || 0,
                  reviewCount: product.reviewCount || 0,
                  thumbnailUrl: product.image || product.thumbnail || '',
                  badges: product.badges || (product.sale ? [product.sale] : [])
                };

                return (
                  <div key={productData.id} className="productItem group/productItem cursor-pointer">
                    <div className="block">
                      {/* 썸네일 */}
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={productData.thumbnailUrl}
                          alt={productData.name}
                          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/productItem:scale-105"
                          onClick={() => {
                            if (handleProductClick) {
                              handleProductClick(product);
                            }
                          }}
                        />
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4">
                          <CartButton
                            colorType="primary"
                            tailwind="p-2.5"
                            onAddProductCallBack={() => {
                              if (handleAddToCart) {
                                handleAddToCart(product);
                              }
                            }}
                          >
                            <CartIcon tailwind="hover-white" />
                          </CartButton>
                        </div>
                      </div>
                      {/* 제품 정보 */}
                      <div 
                        className="mt-3 md:mt-4"
                        onClick={() => {
                          if (handleProductClick) {
                            handleProductClick(product);
                          }
                        }}
                      >
                        <h4 className="text-sm text-gray-900 line-clamp-2">{productData.name}</h4>
                        <div className="mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                          <ProductPrice
                            discountRate={productData.discountRate}
                            price={productData.price}
                            originalPrice={productData.originalPrice}
                          />
                          {productData.reviewCount > 0 && (
                            <ReviewScore
                              starRating={productData.starRating}
                              reviewCount={productData.reviewCount}
                            />
                          )}
                        </div>
                        {productData.badges && productData.badges.length > 0 && (
                          <div className="flex flex-wrap items-center justify-start gap-1.5 mt-2 mt:mb-3">
                            {productData.badges.map((badge: string, index: number) => (
                              <TextBadge
                                text={badge}
                                key={index}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <section className="globalWrapper w-full">
          <NoData
            icon={<ProductIcon tailwind="w-full h-full" />}
            title="등록된 상품이 없습니다"
            description="이 카테고리에는 아직 상품이 등록되지 않았습니다.
            곧 새로운 상품들을 만나보실 수 있습니다."
          />
        </section>
      )}
      
      {/* 페이징 UI (PC에서만, 모바일은 무한스크롤) */}
      {!isMobile && totalPages > 1 && (
        <section className="globalWrapper w-full pb-10">
          <nav
            className="flex items-center justify-center space-x-1"
            aria-label="페이지네이션"
          >
            {/* 첫 페이지로 이동 */}
            <button
              className={`p-2 ${currentPage === 1 ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
              onClick={() => handlePageChange && handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="첫 페이지로 이동"
            >
              <DubbleArrowIcon
                rotate="-90"
                tailwind="w-[16px] h-[16px]"
              />
            </button>

            {/* 이전 페이지 */}
            <button
              className={`p-2 ${currentPage === 1 ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
              onClick={() => handlePageChange && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="이전 페이지"
            >
              <ArrowIcon
                rotate="-90"
                tailwind="w-[16px] h-[16px]"
              />
            </button>

            {/* 페이지 번호들 */}
            <div className="flex items-center space-x-1 px-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    className={`px-2.5 text-sm ${pageNum === currentPage ? 'font-bold text-primary' : 'text-black/40 hover-primary'}`}
                    onClick={() => handlePageChange && handlePageChange(pageNum)}
                    aria-label={`${pageNum}페이지로 이동`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* 다음 페이지 */}
            <button
              className={`p-2 ${currentPage === totalPages ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
              onClick={() => handlePageChange && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
            >
              <ArrowIcon
                rotate="90"
                tailwind="w-[16px] h-[16px]"
              />
            </button>

            {/* 마지막 페이지로 이동 */}
            <button
              className={`p-2 ${currentPage === totalPages ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
              onClick={() => handlePageChange && handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="마지막 페이지로 이동"
            >
              <DubbleArrowIcon
                rotate="90"
                tailwind="w-[16px] h-[16px]"
              />
            </button>
          </nav>
        </section>
      )}
      
      {/* 더보기 버튼 (모바일) */}
      {isMobile && mobilePage < totalPages && (
        <section className="globalWrapper w-full pb-10">
          <button 
            ref={data.loadMoreButtonRef}
            onClick={() => handleLoadMore && handleLoadMore()}
            disabled={isLoadingMore}
            className="load-more-button w-full py-3 text-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {isLoadingMore ? t('로딩 중...') : t('더보기')}
          </button>
        </section>
      )}
    </div>
  );
};

export default ShopProductListSkin;