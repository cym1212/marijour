import fs from 'fs';
import path from 'path';

// 이미지를 base64로 변환하는 함수
function convertImageToBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        const ext = path.extname(imagePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error(`Error converting ${imagePath}:`, error);
        return null;
    }
}

// BrandStory 이미지 변환
const brandStoryImages = {
    'desktop': convertImageToBase64('./public/images/about-01-desktop.jpg'),
    'mobile': convertImageToBase64('./public/images/about-01-mobile.jpg')
};

// TypeScript 파일로 출력
const output = `// BrandStory 이미지 base64 인코딩된 데이터
// 이 파일은 자동 생성되었습니다. 수동으로 편집하지 마세요.

export const BRAND_STORY_IMAGES = {
${Object.entries(brandStoryImages).map(([key, base64]) => 
    `    '${key}': '${base64}'`
).join(',\n')}
};

export default BRAND_STORY_IMAGES;
`;

// 파일 저장
fs.writeFileSync('./app/components/ui/brand/brand-story-images.ts', output);

console.log('BrandStory 이미지 변환 완료!');
console.log('생성된 파일: ./app/components/ui/brand/brand-story-images.ts');
console.log(`변환된 이미지: ${Object.keys(brandStoryImages).length}개`);
Object.entries(brandStoryImages).forEach(([key, base64]) => {
    if (base64) {
        console.log(`- ${key}: ${Math.round(base64.length / 1024)}KB`);
    }
});