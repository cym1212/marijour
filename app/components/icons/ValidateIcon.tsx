/**
 * ValidateIcon 컴포넌트 - 유효성 검사 아이콘
 *
 * 구조:
 * - 유효성 검사 아이콘 SVG
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function ValidateIcon({ tailwind }: { tailwind?: string }) {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.02-8.94a.75.75 0 1 0-1.08-1.04l-2.797 2.9L8.06 9.797a.75.75 0 1 0-1.08 1.041l2.162 2.243 3.876-4.02Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
