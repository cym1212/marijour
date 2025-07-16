/**
 * ReviewFilter 컴포넌트 - 리뷰 정렬 필터
 *
 * 기능:
 * - 별점 높은순/낮은순/최신순 정렬 옵션 제공
 * - 라디오 버튼으로 하나의 정렬 옵션만 선택 가능
 */
export function ReviewFilter({ onChange }: { onChange: (value: string) => void }) {
    return (
        <ul className="flex items-center gap-4">
            <li>
                <input
                    type="radio"
                    name="sort"
                    id="sortByRatingDesc"
                    className="hidden peer"
                    defaultChecked
                    onChange={(e) => onChange('sortByRatingDesc')}
                />
                <label
                    htmlFor="sortByRatingDesc"
                    className="text-sm cursor-pointer text-black/40 peer-checked:text-black"
                >
                    별점 높은순
                </label>
            </li>
            <li>
                <input
                    type="radio"
                    name="sort"
                    id="sortByRatingAsc"
                    className="hidden peer"
                    onChange={(e) => onChange('sortByRatingAsc')}
                />
                <label
                    htmlFor="sortByRatingAsc"
                    className="text-sm cursor-pointer text-black/40 peer-checked:text-black"
                >
                    별점 낮은순
                </label>
            </li>
            <li>
                <input
                    type="radio"
                    name="sort"
                    id="sortByLatest"
                    className="hidden peer"
                    onChange={(e) => onChange('sortByLatest')}
                />
                <label
                    htmlFor="sortByLatest"
                    className="text-sm cursor-pointer text-black/40 peer-checked:text-black"
                >
                    최신순
                </label>
            </li>
        </ul>
    );
}
