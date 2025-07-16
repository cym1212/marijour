/**
 * MinusIcon 컴포넌트 - 빼기(-) SVG 아이콘
 *
 * 구조:
 * - - 모양 빼기 SVG 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function MinusIcon({ tailwind }: { tailwind?: string }) {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 21 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind}`}
        >
            <rect
                x="2.25"
                y="10.75"
                width="1.5"
                height="16"
                rx="0.75"
                transform="rotate(-90 2.25 10.75)"
                fill="currentColor"
            ></rect>
        </svg>
    );
}
