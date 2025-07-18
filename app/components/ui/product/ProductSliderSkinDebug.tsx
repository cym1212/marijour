import React from 'react';

// 디버그용 스킨 - 웹빌더에서 전달되는 데이터 구조 확인
const ProductSliderSkinDebug: React.FC<any> = (props) => {

    
    const { data, options } = props || {};
    const { products, allProducts, currentSlide, itemsPerSlide } = data || {};
    
    return (
        <div style={{ padding: '20px', background: '#f0f0f0' }}>
            <h2>ProductSlider 디버그 정보</h2>
            
            <div style={{ marginTop: '10px' }}>
                <h3>Data 정보:</h3>
                <ul>
                    <li>products 개수: {products?.length || 0}</li>
                    <li>allProducts 개수: {allProducts?.length || 0}</li>
                    <li>currentSlide: {currentSlide}</li>
                    <li>itemsPerSlide: {itemsPerSlide}</li>
                </ul>
            </div>
            
            <div style={{ marginTop: '10px' }}>
                <h3>Options 정보:</h3>
                <ul>
                    <li>sliderTitle: {options?.sliderTitle}</li>
                    <li>showTitle: {String(options?.showTitle)}</li>
                </ul>
            </div>
            
            <div style={{ marginTop: '10px' }}>
                <h3>Products 데이터:</h3>
                {products?.map((product: any, index: number) => (
                    <div key={index} style={{ padding: '5px', border: '1px solid #ccc', marginBottom: '5px' }}>
                        <p>ID: {product.id}</p>
                        <p>이름: {product.name}</p>
                        <p>가격: {product.price}</p>
                        <p>할인가: {product.salePrice}</p>
                        <p>이미지: {product.image || product.thumbnail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSliderSkinDebug;