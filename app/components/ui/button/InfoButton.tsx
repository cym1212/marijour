import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { InfoIcon } from '@/components/icons/InfoIcon';

/**
 * InfoButton 컴포넌트 - 정보 표시 버튼
 *
 * 기능:
 * - 클릭 시 추가 정보 표시
 * - 마우스 hover 시 모달 스타일 툴팁 표시
 */
export function InfoButton({ iconTailwind, children }: { iconTailwind?: string; children: React.ReactNode }) {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleShow = () => {
        setIsTooltipVisible(true);
    };

    const handleClose = () => {
        setIsTooltipVisible(false);
    };

    useGSAP(() => {
        if (!tooltipRef.current) return;

        if (isTooltipVisible) {
            gsap.to(tooltipRef.current, {
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out',
            });
        }
    }, [tooltipRef.current, isTooltipVisible]);

    return (
        <div
            className="relative"
            onMouseEnter={handleShow}
            onMouseLeave={handleClose}
        >
            <InfoIcon tailwind={iconTailwind} />

            {/* 모달 스타일 툴팁 */}
            {isTooltipVisible && (
                <div
                    ref={tooltipRef}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 opacity-0"
                >
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[250px] relative">
                        {/* 컨텐츠 */}
                        {children}

                        {/* 툴팁 화살표 */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                            <div className="border-8 border-transparent border-t-white"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
