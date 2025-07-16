/**
 * ReviewIcon 컴포넌트 - 리뷰 아이콘
 *
 * 기능:
 * - 리뷰 관련 페이지에서 사용할 아이콘
 * - 별점과 채팅 말풍선을 조합한 디자인
 * - NoData 컴포넌트에서 사용
 */
export function ReviewIcon({ tailwind }: { tailwind?: string }) {
    return (
        <svg
            className={tailwind}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 채팅 말풍선 */}
            <path
                d="M48 12H16C12.6863 12 10 14.6863 10 18V34C10 37.3137 12.6863 40 16 40H20V48L28 40H48C51.3137 40 54 37.3137 54 34V18C54 14.6863 51.3137 12 48 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* 별점 (5개) */}
            <g transform="translate(16, 20)">
                {/* 첫 번째 별 */}
                <path
                    d="M6 2L7.09 4.26L9.5 4.61L7.75 6.31L8.18 8.7L6 7.57L3.82 8.7L4.25 6.31L2.5 4.61L4.91 4.26L6 2Z"
                    fill="currentColor"
                />

                {/* 두 번째 별 */}
                <path
                    d="M14 2L15.09 4.26L17.5 4.61L15.75 6.31L16.18 8.7L14 7.57L11.82 8.7L12.25 6.31L10.5 4.61L12.91 4.26L14 2Z"
                    fill="currentColor"
                />

                {/* 세 번째 별 */}
                <path
                    d="M22 2L23.09 4.26L25.5 4.61L23.75 6.31L24.18 8.7L22 7.57L19.82 8.7L20.25 6.31L18.5 4.61L20.91 4.26L22 2Z"
                    fill="currentColor"
                />

                {/* 네 번째 별 */}
                <path
                    d="M30 2L31.09 4.26L33.5 4.61L31.75 6.31L32.18 8.7L30 7.57L27.82 8.7L28.25 6.31L26.5 4.61L28.91 4.26L30 2Z"
                    fill="currentColor"
                />

                {/* 다섯 번째 별 (회색) */}
                <path
                    d="M38 2L39.09 4.26L41.5 4.61L39.75 6.31L40.18 8.7L38 7.57L35.82 8.7L36.25 6.31L34.5 4.61L36.91 4.26L38 2Z"
                    fill="currentColor"
                    opacity="0.3"
                />
            </g>
        </svg>
    );
}
