import React from 'react';

// 스타일 import
import './banner-image-media-skin-scoped.css';

// Base64 이미지 import
import { BANNER_IMAGE_MEDIA } from './banner-image-media-images';

// Mock 데이터 (번들에 포함)
const BANNER_IMAGE_MEDIA_DATA = {
    imageUrl: BANNER_IMAGE_MEDIA.desktop,
    alt: 'About Desktop Banner Image'
};

/**
 * BannerImageMediaSkin 컴포넌트 - 배너 이미지 미디어 UMD 버전
 *
 * 기능:
 * - 데스크톱용 배너 이미지 표시
 * - 호버 시 스케일 애니메이션 효과
 * - lg 브레이크포인트에서만 표시 (hidden lg:block)
 * - 완전히 독립적인 컴포넌트 (props 없음)
 */
export function BannerImageMedia() {
    return (
        <div className="bim-skin-container">
            {/* 배경 이미지 */}
            <div 
                className="bim-skin-background-image"
                style={{ backgroundImage: `url("${BANNER_IMAGE_MEDIA_DATA.imageUrl}")` }}
            />
            {/* 텍스트 오버레이 */}
            <div className="bim-skin-overlay">
                <div className="bim-skin-content">
                    <h2 className="bim-skin-title">Premium Life<br/>Commerce Brand</h2>
                    <p className="bim-skin-description">마리쥬르는 단순한 인테리어 제품을 판매하는 것이 아니라,<br/>
생활하는 공간의 질 높은 라이프 스타일을 디자인할 수 있도록 제안하는<br/>
브랜드입니다. 김성희아고 트렌디한 상품으로 여러분의 공간이 채워지길 바라며,<br/>
고객님과 소통하고 늘 고민하겠습니다.</p>
                </div>
            </div>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(BannerImageMedia as any).SAMPLE_DATA = BANNER_IMAGE_MEDIA_DATA;

export default BannerImageMedia;