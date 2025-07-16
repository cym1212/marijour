import ProductDetailSkin from './ProductDetailSkin';

export default ProductDetailSkin;

// UMD 전역 내보내기 (필수)
if (typeof window !== 'undefined') {
  (window as any).ProductDetailSkin = ProductDetailSkin;
}