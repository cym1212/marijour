import { forwardRef } from 'react';

import { ArrowIcon } from '@/components/icons/ArrowIcon';

import type { SliderNavigationButtonProps } from '@/types/ui';

export const SliderNavigationButton = forwardRef<HTMLDivElement, SliderNavigationButtonProps>(({ direction, rotate, hoverColor }, ref) => {
    const hoveredColor = hoverColor === 'white' ? 'hover-white' : 'hover-black-40';
    const directionClass = direction === 'prev' ? 'left-0' : 'right-0';

    return (
        <div
            ref={ref}
            className={`absolute ${directionClass} top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
            <button
                type="button"
                className="flex items-center justify-center p-3 bg-black/20 text-white hover:bg-white/40 transition-colors duration-300"
                aria-label={direction === 'prev' ? '이전 슬라이드' : '다음 슬라이드'}
            >
                <ArrowIcon
                    rotate={rotate}
                    tailwind={hoveredColor}
                />
            </button>
        </div>
    );
});
