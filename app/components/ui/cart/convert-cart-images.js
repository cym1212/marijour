import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 이미지 파일들 읽어서 base64로 변환
const product1 = fs.readFileSync(path.join(__dirname, '../../../../public/images/product-1.jpg'));
const product2 = fs.readFileSync(path.join(__dirname, '../../../../public/images/product-2.jpg'));
const product3 = fs.readFileSync(path.join(__dirname, '../../../../public/images/product-3.jpg'));

// TypeScript 파일 생성
const tsContent = `// Cart 상품 이미지들을 base64로 인코딩
export const CART_PRODUCT_IMAGES = {
    product1: 'data:image/jpeg;base64,${product1.toString('base64')}',
    product2: 'data:image/jpeg;base64,${product2.toString('base64')}',
    product3: 'data:image/jpeg;base64,${product3.toString('base64')}'
};
`;

// 파일 저장
fs.writeFileSync(path.join(__dirname, 'cart-images.ts'), tsContent);
console.log('Cart images converted to base64 successfully!');