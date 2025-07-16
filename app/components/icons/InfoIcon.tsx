/**
 * InfoIcon 컴포넌트 - 정보 SVG 아이콘
 *
 * 구조:
 * - SVG 기반 정보 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function InfoIcon({ tailwind }: { tailwind?: string }) {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind}`}
        >
            <g
                clipPath="url(#icon-info-svg)"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.5 10a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"
                    fill="currentColor"
                ></path>
                <path
                    d="M9.106 11.52v.097h1.262v-.097c.01-.808.27-1.18.895-1.563.7-.415 1.137-.987 1.143-1.865C12.4 6.809 11.403 6 9.947 6c-1.331 0-2.41.739-2.447 2.189h1.348c.037-.723.555-1.068 1.089-1.068.587 0 1.062.388 1.056.992.006.54-.35.9-.808 1.197-.68.415-1.068.836-1.079 2.21Zm-.172 1.639a.839.839 0 0 0 .84.841c.448 0 .831-.377.831-.841a.845.845 0 0 0-.83-.83c-.464.005-.846.377-.841.83Z"
                    fill="currentColor"
                ></path>
            </g>
            <defs fill="currentColor">
                <clipPath
                    id="icon-info-svg"
                    fill="currentColor"
                >
                    <path
                        transform="translate(2 2)"
                        d="M0 0h16v16H0z"
                        fill="currentColor"
                    ></path>
                </clipPath>
            </defs>
        </svg>
    );
}
