import fs from 'fs';
import path from 'path';

const imageDir = './public/images/';
const imageFiles = [
    'quick-menu-all.jpg',
    'quick-menu-best.jpg',
    'quick-menu-bowl.jpg',
    'quick-menu-cup.jpg',
    'quick-menu-oralcare.jpg',
    'quick-menu-skincare.jpg',
    'quick-menu-homewear.jpg',
    'quick-menu-fabric.jpg'
];

const images = {};

imageFiles.forEach(filename => {
    const imagePath = path.join(imageDir, filename);
    if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        const key = filename.replace('quick-menu-', '').replace('.jpg', '');
        images[key] = `data:image/jpeg;base64,${base64String}`;
        console.log(`${key}: ${base64String.length} chars`);
    }
});

const outputContent = `// Base64 encoded images for QuickMenu
export const QUICK_MENU_IMAGES = ${JSON.stringify(images, null, 2)};
`;

fs.writeFileSync('./app/components/ui/nav/quick-menu-images.ts', outputContent);
console.log('Images converted to base64 and saved to quick-menu-images.ts');