import type { BannerImageProps } from '@/types/ui';

/**
 * BannerImage 컴포넌트 - 반응형 배경 이미지 배너
 *
 * 구조:
 * - 단일 div로 데스크톱/모바일 반응형 배경 이미지 처리
 * - 오버레이 옵션 지원
 * - hover 시 scale 애니메이션 지원 (group-hover 패턴)
 *
 * Props:
 * - src: { desktop: string, mobile: string } - 반응형 이미지 경로
 * - isOverlay?: boolean - 오버레이 표시 여부
 *
 * 애니메이션:
 * - group-hover:scale-105로 1.05배 확대
 * - transition-transform으로 부드러운 애니메이션
 */
export function BannerImage({ src, isOverlay }: BannerImageProps) {
    const { desktop, mobile } = src;

    return (
        <div className="bannerImage relative w-full h-full">
            {/* 데스크톱 이미지 */}
            <div
                className="bannerImageMedia hidden lg:block w-full h-full bg-no-repeat bg-center bg-cover transition-transform duration-300 ease-out group-hover/bannerImage:scale-105"
                style={{ backgroundImage: `url(${desktop})` }}
            ></div>
            {/* 모바일 이미지 */}
            <div
                className="bannerImageMedia block lg:hidden w-full h-full bg-no-repeat bg-center bg-cover transition-transform duration-300 ease-out group-hover/bannerImage:scale-105"
                style={{ backgroundImage: `url(${mobile})` }}
            ></div>
            {isOverlay && <div className="bannerImageOverlay absolute top-0 left-0 w-full h-full bg-black/50"></div>}
        </div>
    );
}
