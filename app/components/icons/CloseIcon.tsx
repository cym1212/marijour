/**
 * CloseIcon 컴포넌트 - 닫기(X) SVG 아이콘
 *
 * 구조:
 * - X 모양 닫기 SVG 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function CloseIcon({ tailwind }: { tailwind?: string }) {
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
                d="M10 8.939 6.11 5.05a.75.75 0 0 0-1.06 1.06L8.938 10 5.05 13.889a.75.75 0 0 0 1.06 1.06l8.84-8.838a.75.75 0 0 0-1.061-1.061L9.999 8.939Zm3.888 6.014-3.889-3.89 1.06-1.06 3.89 3.889a.75.75 0 0 1-1.061 1.06Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
