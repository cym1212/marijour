/**
 * StarIcon 컴포넌트 - 별 SVG 아이콘
 *
 * 구조:
 * - SVG 기반 별 아이콘
 * - 20x20px 고정 크기
 * - currentColor로 부모 요소 색상 상속
 */
export function StarIcon({ tailwind }: { tailwind?: string }) {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind}`}
        >
            <path
                d="M22.991 5.425a1.126 1.126 0 0 1 2.02 0L30.36 16.26c.164.332.481.563.848.616l11.959 1.738a1.126 1.126 0 0 1 .624 1.92l-8.654 8.436a1.127 1.127 0 0 0-.323.997l2.042 11.91a1.126 1.126 0 0 1-1.634 1.187l-10.696-5.623a1.126 1.126 0 0 0-1.048 0l-10.696 5.623a1.126 1.126 0 0 1-1.634-1.187l2.043-11.91a1.126 1.126 0 0 0-.324-.997l-8.654-8.435a1.126 1.126 0 0 1 .625-1.921l11.958-1.738c.367-.053.684-.284.848-.616l5.348-10.836Z"
                fill="currentColor"
            />
        </svg>
    );
}
