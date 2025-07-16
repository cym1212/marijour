/**
 * DubbleArrowIcon 컴포넌트 - 더블 화살표 SVG 아이콘
 *
 * 구조:
 * - 회전 가능한 더블 화살표 SVG 아이콘
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
export function DubbleArrowIcon({ rotate, tailwind = '' }: { rotate?: string; tailwind?: string }) {
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
                d="M9.292 9.209a1.036 1.036 0 0 1 1.414 0L17 15.202a.69.69 0 0 1 0 1.01.777.777 0 0 1-1.06 0l-5.94-5.656-5.94 5.656a.777.777 0 0 1-1.06 0 .69.69 0 0 1 0-1.01l6.293-5.993Z"
                fill="currentColor"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.292 3.494a1.036 1.036 0 0 1 1.414 0L17 9.487a.69.69 0 0 1 0 1.01.777.777 0 0 1-1.06 0l-5.94-5.656-5.94 5.656a.777.777 0 0 1-1.06 0 .69.69 0 0 1 0-1.01l6.293-5.993Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
