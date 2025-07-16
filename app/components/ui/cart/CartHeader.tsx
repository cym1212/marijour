import { CheckLabelBox } from '@/components/ui/input/CheckLabelBox';

interface CartHeaderProps {
    selectedItemsCount: number;
    totalItemsCount: number;
    isAllSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    onDeleteSelected: () => void;
}

/**
 * CartHeader 컴포넌트 - 장바구니 목록 헤더
 *
 * 기능:
 * - 전체 선택/해제 체크박스
 * - 선택된 상품 수 표시
 * - 선택 삭제 버튼
 */
export function CartHeader({ selectedItemsCount, totalItemsCount, isAllSelected, onSelectAll, onDeleteSelected }: CartHeaderProps) {
    return (
        <div className="flex items-center justify-between py-4 gap-4">
            <CheckLabelBox
                id="itemSelectAll"
                label={`전체 선택 (${selectedItemsCount}/${totalItemsCount})`}
                checked={isAllSelected}
                onChange={onSelectAll}
            />
            <button
                type="button"
                aria-label="선택 삭제"
                className="text-sm underline hover-black-80 shrink-0"
                onClick={onDeleteSelected}
                disabled={selectedItemsCount === 0}
            >
                선택 삭제
            </button>
        </div>
    );
}
