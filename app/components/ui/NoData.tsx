/**
 * NoData 컴포넌트 - 데이터 없음 상태 표시
 * @param icon - 표시할 아이콘 (선택적)
 * @param title - 메인 제목
 * @param description - 부가 설명 (선택적)
 * @param actionButton - 액션 버튼 (선택적)
 * @param tailwind - 추가 CSS 클래스
 */
import type { NoDataProps } from '@/types/ui';
export function NoData({ icon, title, description, actionButton, tailwind = '' }: NoDataProps) {
    return (
        <div className={`text-center py-15 md:py-20 ${tailwind}`}>
            {/* 아이콘 영역 */}
            {icon && (
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-black/30">{icon}</div>
                </div>
            )}

            {/* 제목 */}
            <h3 className="text-md md:text-xl text-black/60 mb-2 md:mb-3">{title}</h3>

            {/* 설명 */}
            {description && <p className="text-xs md:text-sm text-black/40 mb-6 max-w-md mx-auto leading-body whitespace-pre-line">{description}</p>}

            {/* 액션 버튼 */}
            {actionButton && <div className="mt-6">{actionButton}</div>}
        </div>
    );
}
