/**
 * SearchIcon 컴포넌트 - 검색 SVG 아이콘
 *
 * 구조:
 * - 돋보기 모양 SVG 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function SearchIcon({ tailwind }: { tailwind?: string }) {
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
                d="M14.75 9.125a5.375 5.375 0 1 1-10.75 0 5.375 5.375 0 0 1 10.75 0Zm-1.213 5.473a6.875 6.875 0 1 1 1.088-1.033l3.155 3.155a.75.75 0 1 1-1.06 1.06l-3.183-3.182Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
