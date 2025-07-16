import { InfoDataList } from '@/components/ui/order';

import type { InfoDataListContainerProps } from '@/types/order';

/**
 * InfoDataListContainer 컴포넌트 - 정보 목록 컨테이너
 *
 * 기능:
 * - 제목과 함께 정보 목록을 감싸는 컨테이너
 * - 상단 테두리 및 패딩 제공
 *
 * 파라미터:
 * @param title - 섹션 제목
 * @param data - 표시할 데이터 목록
 */
export function InfoDataListContainer({ title, data }: InfoDataListContainerProps) {
    return (
        <div className="py-6 border-t border-black">
            <div>
                <h3 className="font-bold">{title}</h3>
            </div>
            <div className="w-full mb-2 mt-6">
                <InfoDataList data={data} />
            </div>
        </div>
    );
}
