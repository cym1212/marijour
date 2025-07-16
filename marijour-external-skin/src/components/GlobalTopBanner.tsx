import React, { useEffect, useRef } from 'react';

interface GlobalTopBannerProps {
  text: string;
}

export function GlobalTopBanner({ text }: GlobalTopBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade-in 애니메이션 (GSAP 대신 CSS transition 사용)
    if (bannerRef.current) {
      bannerRef.current.style.opacity = '0';
      setTimeout(() => {
        if (bannerRef.current) {
          bannerRef.current.style.transition = 'opacity 0.9s ease-out';
          bannerRef.current.style.opacity = '1';
        }
      }, 100);
    }
  }, []);

  return (
    <div
      id="globalTopBanner"
      ref={bannerRef}
      className="marijour-global-top-banner"
    >
      <div className="marijour-wrapper">
        <span className="banner-text">{text}</span>
      </div>
    </div>
  );
}