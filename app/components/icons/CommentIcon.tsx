/**
 * CommentIcon 컴포넌트 - 댓글 SVG 아이콘
 *
 * 구조:
 * - 말풍선 모양 댓글 SVG 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function CommentIcon({ tailwind }: { tailwind?: string }) {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 4.75A2.75 2.75 0 0 1 4.75 2h10.5A2.75 2.75 0 0 1 18 4.75v7a2.75 2.75 0 0 1-2.75 2.75h-2.607l-2.026 2.927a.75.75 0 0 1-1.234 0L7.357 14.5H4.75A2.75 2.75 0 0 1 2 11.75v-7ZM4.75 3.5c-.69 0-1.25.56-1.25 1.25v7c0 .69.56 1.25 1.25 1.25h3a.75.75 0 0 1 .617.323L10 15.683l1.633-2.36A.75.75 0 0 1 12.25 13h3c.69 0 1.25-.56 1.25-1.25v-7c0-.69-.56-1.25-1.25-1.25H4.75ZM6 9.75A.75.75 0 0 1 6.75 9h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 9.75ZM6.75 6a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
