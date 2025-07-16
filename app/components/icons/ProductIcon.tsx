/**
 * ProductIcon 컴포넌트 - 상품 아이콘
 *
 * 기능:
 * - 상품 관련 페이지에서 사용할 아이콘
 * - 쇼핑백과 상품 박스를 조합한 디자인
 * - NoData 컴포넌트에서 사용
 */
export function ProductIcon({ tailwind }: { tailwind?: string }) {
    return (
        <svg
            className={tailwind}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 쇼핑백 */}
            <path
                d="M16 20V56C16 58.2091 17.7909 60 20 60H44C46.2091 60 48 58.2091 48 56V20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            <path
                d="M12 20H52L50 16H14L12 20Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* 손잡이 */}
            <path
                d="M22 24V16C22 12.6863 24.6863 10 28 10H36C39.3137 10 42 12.6863 42 16V24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* 상품 박스들 */}
            <rect
                x="20"
                y="28"
                width="8"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />

            <rect
                x="32"
                y="28"
                width="8"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />

            <rect
                x="20"
                y="40"
                width="8"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />

            <rect
                x="32"
                y="40"
                width="8"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />

            {/* 상품 표시 점들 */}
            <circle
                cx="24"
                cy="32"
                r="1"
                fill="currentColor"
            />
            <circle
                cx="36"
                cy="32"
                r="1"
                fill="currentColor"
            />
            <circle
                cx="24"
                cy="44"
                r="1"
                fill="currentColor"
            />
            <circle
                cx="36"
                cy="44"
                r="1"
                fill="currentColor"
            />
        </svg>
    );
}
