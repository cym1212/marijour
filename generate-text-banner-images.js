import fs from 'fs';
import path from 'path';

const imageDir = './public/images/';
const imageFiles = [
    'text-banner-1.jpg',
    'text-banner-2.jpg'
];

const images = {};

imageFiles.forEach(filename => {
    const imagePath = path.join(imageDir, filename);
    if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        const key = filename.replace('text-banner-', '').replace('.jpg', '');
        images[key] = `data:image/jpeg;base64,${base64String}`;
        console.log(`${key}: ${base64String.length} chars`);
    }
});

const outputContent = `// Base64 encoded images for TextBanner
export const TEXT_BANNER_IMAGES = ${JSON.stringify(images, null, 2)};
`;

fs.writeFileSync('./app/components/ui/banner/text-banner-images.ts', outputContent);
console.log('Text banner images converted to base64 and saved to text-banner-images.ts');