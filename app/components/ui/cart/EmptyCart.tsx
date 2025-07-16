import { ColorButton } from '@/components/ui/button/ColorButton';

/**
 * EmptyCart 컴포넌트 - 빈 장바구니 상태
 *
 * 기능:
 * - 빈 장바구니 메시지 표시
 * - 쇼핑 페이지로 이동 버튼
 */
export function EmptyCart() {
    return (
        <div className="w-full h-full max-w-[480px] mx-auto flex flex-col items-center justify-center">
            <h3 className="font-serif text-2xl mb-3">장바구니가 비어있어요</h3>
            <p className="text-black/40 mb-10">고객님의 취향에 맞는 상품을 담아 쇼핑을 즐겨보세요!</p>
            <ColorButton
                type="button"
                colorType="primary"
                to="/shop"
                tailwind="w-full px-4.5 py-3.5"
            >
                상품 채우러가기
            </ColorButton>
        </div>
    );
}
