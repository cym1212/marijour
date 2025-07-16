/**
 * ColorButton 컴포넌트 - 색상별 버튼
 * @param children - 버튼 내용
 * @param colorType - 색상 타입 (primary, white, grayLine)
 * @param ariaLabel - 접근성 라벨
 * @param type - 버튼 타입
 * @param onClick - 클릭 핸들러
 * @param tailwind - 추가 CSS 클래스
 * @param to - 링크 경로 (Link 컴포넌트로 렌더링)
 * @param disabled - 비활성화 여부
 */
import { Link } from 'react-router';

import type { ColorButtonProps } from '@/types/ui';

export function ColorButton({ children, colorType, ariaLabel, type, onClick, tailwind = '', to, disabled = false }: ColorButtonProps) {
    const colors = {
        primary: 'bg-primary text-white border-primary hover-bg-primary-80',
        white: 'bg-white text-primary border-primary hover-bg-primary-10',
        grayLine: 'bg-white text-black/80 border-black/20 hover-bg-primary-10',
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    return (
        <>
            {to ? (
                <Link
                    to={to}
                    className={`flex items-center justify-center border hover:bg-primary/90 transition-colors ${colors[colorType]} ${disabledStyles} ${tailwind}`}
                >
                    {children}
                </Link>
            ) : (
                <button
                    type={type}
                    aria-label={ariaLabel}
                    disabled={disabled}
                    className={`flex items-center justify-center border hover:bg-primary/90 transition-colors ${colors[colorType]} ${disabledStyles} ${tailwind}`}
                    onClick={onClick}
                >
                    {children}
                </button>
            )}
        </>
    );
}
