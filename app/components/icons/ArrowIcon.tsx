/**
 * ArrowIcon 컴포넌트 - 화살표 SVG 아이콘
 *
 * 구조:
 * - 회전 가능한 화살표 SVG 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 * - rotate prop으로 회전 각도 제어
 *
 * Props:
 * - rotate?: string - 회전 각도 ('0', '90', '180', '270')
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function ArrowIcon({ rotate, tailwind = '' }: { rotate?: string; tailwind?: string }) {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind}`}
            style={{ transform: rotate ? `rotate(${rotate}deg)` : 'none' }}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
