import React from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SkinProps } from '@withcookie/webbuilder-sdk';
import { CartIcon } from '@/components/icons';
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
  
  // 액션 사용
  const { handleAddToCart, handleProductClick } = actions;

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

  return (
    <div className="shopContainer">
      {products.length > 0 ? (
        <>
          <section className="globalWrapper w-full pb-2">
            <div className="mt-1">
              <p className="text-xs md:text-sm text-black/60">TOTAL {totalProducts} ITEMS</p>
            </div>
          </section>
          <section className="productsContainer globalWrapper w-full pb-5 md:pb-10 mb-5 md:mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-10 md:gap-y-15">
              {products.map((product: Product) => {
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
    </div>
  );
};

export default ShopProductListSkin;