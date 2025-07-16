import React, { useState } from 'react';
import { ProductImage } from '../types';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <img
          src={selectedImage.url}
          alt={selectedImage.alt || productName}
          className="gallery-main-image"
        />
      </div>
      
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`gallery-thumbnail ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};