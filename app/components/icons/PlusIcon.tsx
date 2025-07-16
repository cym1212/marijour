/**
 * PlusIcon 컴포넌트 - 더하기(+) SVG 아이콘
 *
 * 구조:
 * - + 모양 더하기 SVG 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 *
 * 애니메이션:
 * - CSS hover 효과 (hover-primary 클래스)
 *
 * Props:
 * - tailwind?: string - 추가 Tailwind CSS 클래스
 */
export function PlusIcon({ tailwind }: { tailwind?: string }) {
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
                d="M10.238 2.75c.394 0 .714.336.714.75v5.75h5.476c.395 0 .714.336.714.75s-.32.75-.714.75h-5.476v5.75c0 .414-.32.75-.714.75-.395 0-.715-.336-.715-.75v-5.75H4.047c-.394 0-.714-.336-.714-.75s.32-.75.714-.75h5.476V3.5c0-.414.32-.75.715-.75Z"
                fill="currentColor"
            ></path>
        </svg>
    );
}
