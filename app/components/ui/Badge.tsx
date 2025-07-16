/**
 * TextBadge 컴포넌트 - 텍스트 뱃지
 *
 * 기능:
 * - 상품/콘텐츠에 표시되는 작은 텍스트 뱃지
 * - 프라이머리 컬러 테두리 스타일
 *
 * 파라미터:
 * @param text - 뱃지에 표시할 텍스트
 */
export function TextBadge({ text }: { text: string }) {
    return <span className="text-xs text-primary border border-primary px-1">{text}</span>;
}
