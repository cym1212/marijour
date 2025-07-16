import React, { useEffect } from 'react';
import { ComponentSkinProps } from './types';
import './product-list-skin.scss';

// ✅ 원본 앱 /app/routes/shop.$/index.tsx 디자인 정확히 복사 + 속성 패널 옵션 반영
const ProductListSkin: React.FC<ComponentSkinProps> = ({ data, actions, utils, options }) => {
  const { t, formatCurrency } = utils;
  
  // 원본과 동일한 데이터 구조
  const products = data.products || [];
  const loading = data.loading || false;
  const showStock = data.showStock || false;
  const itemsPerRow = data.itemsPerRow || 4;
  
  const { handleAddToCart, handleSearch, handleSortChange, handlePageChange, handleLoadMore } = actions;

  // ✅ 속성 패널에서 설정 가능한 모든 옵션 (문서 가이드 기준)
  const {
    // 레이아웃 설정
    lg = 12,
    className = 'padding-tb-40',
    itemsPerPage = 20,
    
    // 필터링 설정 (서버에서 처리되지만 UI에서 참조)
    categoryId,
    include_product_ids,
    exclude_product_ids,
    include_category_ids,
    exclude_category_ids,
    excludeIndexes,
    
    // 표시 설정
    showPrice = true,
    showAddToCart = true,
    showPagination = true,
    enableInfiniteScroll = true,
    
    // 스타일 설정
    backgroundColor = '#ffffff',
    padding = '20px',
    borderRadius = '8px',
    priceColor = '#ff6b6b',
    cartButtonColor = '#007bff',
    stockTextColor = '#28a745',
    
    // 기존 호환성 옵션
    buttonColor,
    theme
  } = options;

  // 반응형 그리드 컬럼 계산
  const getGridColumns = () => {
    if (window.innerWidth < 768) return 2;  // 모바일: 2열
    return itemsPerRow || 4;  // PC: 설정값 또는 4열
  };

  const [gridColumns, setGridColumns] = React.useState(getGridColumns());

  React.useEffect(() => {
    const handleResize = () => setGridColumns(getGridColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerRow]);

  // 모바일 감지
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일 무한 스크롤 관련 상태
  const mobileProducts = data.mobileProducts || [];
  const isLoadingMore = data.isLoadingMore || false;
  const hasMore = data.hasMore || (data.currentPage < data.totalPages);
  const displayProducts = isMobile && enableInfiniteScroll ? mobileProducts : products;

  // 더보기 버튼 ref
  const loadMoreButtonRef = React.useRef<HTMLButtonElement>(null);

  // 자동 더보기 (Intersection Observer)
  React.useEffect(() => {
    if (!isMobile || !enableInfiniteScroll || !loadMoreButtonRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoadingMore) {
            // 버튼이 화면에 보이면 0.5초 후 자동 로드
            setTimeout(() => {
              if (hasMore && !isLoadingMore && handleLoadMore) {
                handleLoadMore();
              }
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreButtonRef.current);
    return () => observer.disconnect();
  }, [isMobile, enableInfiniteScroll, hasMore, isLoadingMore, handleLoadMore]);

  // 테마 색상 CSS 변수 설정 (속성 패널 색상 우선 적용)
  const finalButtonColor = cartButtonColor || buttonColor || theme?.colorset?.primaryColor || '#89a1be';
  const finalPriceColor = priceColor || '#ff6b6b';
  
  const themeStyles = {
    '--primary-color': finalButtonColor,
    '--secondary-color': theme?.colorset?.secondaryColor || '#FAFAF8', 
    '--tertiary-color': theme?.colorset?.tertiaryColor || '#F5BF42',
    '--price-color': finalPriceColor,
    '--stock-color': stockTextColor,
    backgroundColor,
    borderRadius,
    padding,
  } as React.CSSProperties;

  // 원본 앱의 GSAP 애니메이션 효과 제거 (opacity 문제 해결)
  // 장바구니 추가 후 화면이 사라지는 문제를 방지하기 위해 애니메이션 제거

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className={className} style={themeStyles}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <div className="spinner-border" role="status">
            <span className="sr-only">{t('로딩 중...')}</span>
          </div>
          <p style={{ marginTop: '10px' }}>{t('상품을 불러오는 중입니다...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`shopContainer ${className}`} style={{...themeStyles}}>
      {/* 원본 앱의 BreadcrumbTabsHeader 영역 - 스킨에서는 생략 */}
      
      {displayProducts.length > 0 ? (
        <>
          
          {/* 상품 그리드 (동적 컬럼 수 적용) */}
          <section className="productsContainer globalWrapper w-full pb-5 md:pb-10 mb-5 md:mb-10">
            <div 
              className="grid gap-x-4 md:gap-x-5 gap-y-10 md:gap-y-15"
              style={{
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`
              }}
            >
              {displayProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="productItem group/productItem cursor-pointer"
                >
                  {/* Link는 스킨에서 onClick으로 대체 */}
                  <div 
                    className="block"
                    onClick={(e) => {
                      // 장바구니 버튼 클릭 시에는 상품 상세 페이지로 이동하지 않음
                      if ((e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      utils.navigate && utils.navigate(`/products/${product.id}`);
                    }}
                  >
                    {/* 썸네일 (원본과 동일) */}
                    <div className="relative overflow-hidden">
                      <div className="w-full h-full aspect-square">
                        <img
                          src={product.image || product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/productItem:scale-105"
                        />
                      </div>
                      {/* 장바구니 버튼 (showAddToCart 설정에 따라 표시) */}
                      {showAddToCart && (
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4">
                          <button
                            className="p-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:opacity-90"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (handleAddToCart) {
                                handleAddToCart(product);
                              }
                              return false;
                            }}
                            type="button"
                            style={{
                              backgroundColor: finalButtonColor,
                              border: `1px solid ${finalButtonColor}`
                            }}
                          >
                          {/* CartIcon SVG (원본과 동일) */}
                          <svg 
                            className="w-5 h-5 text-white transition-colors duration-300" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 13V17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* 제품 정보 (속성 패널 설정 반영) */}
                    <div className="mt-3 md:mt-4">
                      <h4 className="text-sm text-gray-900 line-clamp-2">{product.name}</h4>
                      <div className="mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                        {/* 가격 표시 (showPrice 설정에 따라 표시) */}
                        {showPrice && (
                          <div className="flex items-center flex-wrap gap-1.5">
                            {product.discountPercent > 0 && (
                              <span 
                                className="text-xs font-bold px-1 py-0.5 rounded-sm"
                                style={{
                                  color: finalPriceColor,
                                  backgroundColor: 'rgba(255, 107, 107, 0.1)'
                                }}
                              >
                                {product.discountPercent}%
                              </span>
                            )}
                            <p 
                              className="text-base font-bold m-0"
                              style={{ color: finalPriceColor }}
                            >
                              {formatCurrency ? formatCurrency(product.price) : `${product.price.toLocaleString()}원`}
                            </p>
                            {product.originalPrice && (
                              <del className="text-sm font-bold text-black/40">
                                {formatCurrency ? formatCurrency(product.originalPrice) : `${product.originalPrice.toLocaleString()}원`}
                              </del>
                            )}
                          </div>
                        )}
                        
                        {/* 재고 표시 (showStock 설정에 따라 표시) */}
                        {showStock && (
                          <div 
                            className="text-xs"
                            style={{ 
                              color: product.isInStock !== false ? stockTextColor : '#dc3545' 
                            }}
                          >
                            {product.isInStock !== false ? 
                              `${t('재고')}: ${product.stockCount || 0}${t('개')}` : 
                              t('품절')
                            }
                          </div>
                        )}
                        
                        {/* ReviewScore 컴포넌트 재현 */}
                        {product.reviewCount > 0 && (
                          <div className="flex items-center gap-1">
                            <svg 
                              className="w-3 h-3"
                              style={{ color: finalButtonColor }}
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <p 
                              className="text-xs font-bold m-0"
                              style={{ color: finalButtonColor }}
                            >
                              {product.rating}
                            </p>
                            <p className="text-xs text-black/60 m-0">({product.reviewCount})</p>
                          </div>
                        )}
                      </div>
                      
                      {/* TextBadge 컴포넌트들 재현 */}
                      {product.badges && (
                        <div className="flex flex-wrap items-center justify-start gap-1.5 mt-2 mb-3">
                          {product.badges.map((badge, index) => (
                            <span
                              key={index}
                              className="text-xs px-1 leading-tight"
                              style={{
                                color: finalButtonColor,
                                border: `1px solid ${finalButtonColor}`
                              }}
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* 페이지네이션 (PC) 또는 더보기 버튼 (모바일) */}
          {showPagination && (
            <>
              {/* PC 페이지네이션 - 원본 앱 디자인 */}
              {!isMobile && data.totalPages > 1 && (
                <section className="globalWrapper w-full pb-5 md:pb-10">
                  <div className="product-pagination" style={{ marginTop: '40px' }}>
                    <ul className="pagination" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '0',
                      listStyle: 'none',
                      margin: '0'
                    }}>
                      {/* 이전 페이지 */}
                      <li style={{ margin: '0 5px' }}>
                        <button
                          onClick={() => handlePageChange && handlePageChange(Math.max(1, data.currentPage - 1))}
                          disabled={data.currentPage === 1}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            backgroundColor: '#f5f5f5',
                            color: '#333',
                            border: 'none',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            cursor: data.currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: data.currentPage === 1 ? 0.5 : 1,
                            fontSize: '12px'
                          }}
                          onMouseEnter={(e) => {
                            if (data.currentPage !== 1) {
                              e.target.style.backgroundColor = '#e0e0e0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (data.currentPage !== 1) {
                              e.target.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                        >
                          ‹
                        </button>
                      </li>
                      
                      {/* 페이지 번호들 */}
                      {(() => {
                        const pageNumbers = [];
                        const maxVisiblePages = 5;
                        const currentPage = data.currentPage || 1;
                        const totalPages = data.totalPages || 1;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage < maxVisiblePages - 1) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          const isActive = currentPage === i;
                          pageNumbers.push(
                            <li key={i} style={{ margin: '0 5px' }}>
                              <button
                                onClick={() => handlePageChange && handlePageChange(i)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '4px',
                                  backgroundColor: isActive ? '#6c4bd1' : '#f5f5f5',
                                  color: isActive ? 'white' : '#333',
                                  border: 'none',
                                  textDecoration: 'none',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: isActive ? 'bold' : 'normal'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isActive) {
                                    e.target.style.backgroundColor = '#e0e0e0';
                                  } else {
                                    e.target.style.backgroundColor = '#5a3ec0';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isActive) {
                                    e.target.style.backgroundColor = '#f5f5f5';
                                  } else {
                                    e.target.style.backgroundColor = '#6c4bd1';
                                  }
                                }}
                              >
                                {i}
                              </button>
                            </li>
                          );
                        }
                        
                        return pageNumbers;
                      })()}
                      
                      {/* 다음 페이지 */}
                      <li style={{ margin: '0 5px' }}>
                        <button
                          onClick={() => handlePageChange && handlePageChange(Math.min(data.totalPages, data.currentPage + 1))}
                          disabled={data.currentPage === data.totalPages}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            backgroundColor: '#f5f5f5',
                            color: '#333',
                            border: 'none',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            cursor: data.currentPage === data.totalPages ? 'not-allowed' : 'pointer',
                            opacity: data.currentPage === data.totalPages ? 0.5 : 1,
                            fontSize: '12px'
                          }}
                          onMouseEnter={(e) => {
                            if (data.currentPage !== data.totalPages) {
                              e.target.style.backgroundColor = '#e0e0e0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (data.currentPage !== data.totalPages) {
                              e.target.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                        >
                          ›
                        </button>
                      </li>
                    </ul>
                  </div>
                </section>
              )}

              {/* 모바일 더보기 버튼 */}
              {isMobile && enableInfiniteScroll && hasMore && (
                <section className="globalWrapper w-full pb-5 md:pb-10">
                  <div className="flex justify-center">
                    <button
                      ref={loadMoreButtonRef}
                      onClick={() => handleLoadMore && handleLoadMore()}
                      disabled={isLoadingMore}
                      className="px-6 py-3 text-sm font-medium rounded-md transition-all duration-300 min-w-[120px]"
                      style={{
                        backgroundColor: isLoadingMore ? '#f8f9fa' : '#6c4bd1',
                        color: isLoadingMore ? '#666' : '#fff',
                        border: `1px solid ${isLoadingMore ? '#ddd' : '#6c4bd1'}`,
                        cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                        opacity: isLoadingMore ? 0.6 : 1
                      }}
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>{t('로딩 중...')}</span>
                        </div>
                      ) : (
                        t('더보기')
                      )}
                    </button>
                  </div>
                </section>
              )}

              {/* 모바일 - 모든 상품을 본 경우 */}
              {isMobile && enableInfiniteScroll && !hasMore && displayProducts.length > 0 && (
                <section className="globalWrapper w-full pb-5 md:pb-10">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 py-4">
                      {t('모든 상품을 보셨습니다.')}
                    </p>
                  </div>
                </section>
              )}
            </>
          )}
        </>
      ) : (
        /* NoData 컴포넌트 재현 (원본과 동일) */
        <section className="globalWrapper w-full">
          <div className="flex flex-col items-center gap-4 py-20 md:py-30 text-center">
            <div className="w-20 h-20">
              {/* ProductIcon SVG */}
              <svg 
                className="w-full h-full text-black/20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 13V17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-medium text-gray-800 m-0">
              {t('등록된 상품이 없습니다')}
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-600 m-0 whitespace-pre-line">
              {t('이 카테고리에는 아직 상품이 등록되지 않았습니다.\n곧 새로운 상품들을 만나보실 수 있습니다.')}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

// ✅ UMD 내보내기 (필수)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductListSkin;
} else {
  window.ProductListSkin = ProductListSkin; // 관리자에서 설정한 정확한 이름 사용
}

export default ProductListSkin;