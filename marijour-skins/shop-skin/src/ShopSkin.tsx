import React from 'react';
import { ComponentSkinProps } from './types';
import { ProductItem } from './components/ProductItem';
import { NoData } from './components/NoData';
import './shop-skin.scss';

const ShopSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  utils, 
  mode 
}) => {
  const {
    products = [],
    totalCount,
    categoryName = '상품',
    noDataTitle = '등록된 상품이 없습니다',
    noDataDescription = '이 카테고리에는 아직 상품이 등록되지 않았습니다.\n곧 새로운 상품들을 만나보실 수 있습니다.',
  } = data || {};

  // 테마 색상을 CSS 변수로 설정
  const themeStyles = options?.theme ? {
    '--primary-color': options.theme.colorset?.primaryColor || '#121821',
    '--secondary-color': options.theme.colorset?.secondaryColor || '#FAFAF8',
    '--tertiary-color': options.theme.colorset?.tertiaryColor || '#F5BF42',
  } as React.CSSProperties : {};

  return (
    <div className="shop-skin" style={themeStyles}>
      <div className="shop-container">
        {/* 브레드크럼 헤더 영역 */}
        <section className="shop-header">
          <h2 className="category-title">{categoryName}</h2>
        </section>

        {products.length > 0 ? (
          <>
            {/* 상품 개수 표시 */}
            <section className="shop-count">
              <p className="total-count">TOTAL {totalCount || products.length} ITEMS</p>
            </section>

            {/* 상품 그리드 */}
            <section className="products-container">
              <div className="product-grid">
                {products.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    utils={utils}
                    actions={actions}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="no-products">
            <NoData
              title={noDataTitle}
              description={noDataDescription}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default ShopSkin;