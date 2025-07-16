import ProductListSkin from './ProductListSkin';

export default ProductListSkin;

// UMD 전역 내보내기 (필수)
if (typeof window !== 'undefined') {
  (window as any).ProductListSkin = ProductListSkin;
}