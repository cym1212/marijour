/**
 * UserIcon 컴포넌트 - 사용자 SVG 아이콘
 *
 * 구조:
 * - SVG 기반 사용자 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function UserIcon({ tailwind }: { tailwind?: string }) {
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
                d="M12.1 5.6a2.1 2.1 0 1 1-4.2 0 2.1 2.1 0 0 1 4.2 0ZM10 9.2A3.6 3.6 0 1 0 10 2a3.6 3.6 0 0 0 0 7.2Zm-3 3.1h6a3.5 3.5 0 0 1 3.5 3.5v.7h-13v-.7A3.5 3.5 0 0 1 7 12.3Zm-5 3.5a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5V17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1.2Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
