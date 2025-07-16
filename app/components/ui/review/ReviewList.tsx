import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ReviewFilter } from '@/components/ui/review/ReviewFilter';
import { ReviewItem } from '@/components/ui/review/ReviewItem';

import type { Review } from '@/types/review';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * ReviewContainer 컴포넌트 - 리뷰 목록 전체를 관리하는 컨테이너
 *
 * 기능:
 * - 리뷰 데이터 단순 상태로 정렬 및 필터링 (기획에 따라 맞는 방법으로 수정 필요 / Pagination은 URL Query로 구현되어 있음)
 * - 이미지 확대/축소 상태 관리
 * - 개별 리뷰 아이템 렌더링
 */
export function ReviewList({ data, isVisibleProductInfo }: { data: Review[]; isVisibleProductInfo: boolean }) {
    const [filteredReviews, setFilteredReviews] = useState<Review[]>(data);
    const [sortOption, setSortOption] = useState('sortByRatingDesc');
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

    const handleSortChange = (value: string) => {
        setSortOption(value);
    };

    const handleImageClick = (reviewId: string) => {
        setExpandedReviews((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        setFilteredReviews(data);
    }, [data]);

    useEffect(() => {
        let sortedReviews = [...data];

        switch (sortOption) {
            case 'sortByRatingDesc':
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'sortByRatingAsc':
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'sortByLatest':
                sortedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            default:
                break;
        }

        setFilteredReviews(sortedReviews);
    }, [sortOption]);

    useGSAP(() => {
        const reviewItems = gsap.utils.toArray('.reviewList .reviewItem') as Element[];

        if (reviewItems.length === 0) return;

        ScrollTrigger.batch(reviewItems, {
            start: 'top 95%',
            once: true,
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'power2.out',
                }),
        });
    }, [filteredReviews]);

    return (
        <div className="reviewList border-t border-black">
            <div className="py-3">
                <ReviewFilter onChange={handleSortChange} />
            </div>
            <div className="border-t border-black/10">
                <ul>
                    {filteredReviews.map((review, index) => {
                        // 고유한 리뷰 식별자 생성 (인덱스 + 상품ID + 작성자)
                        const reviewId = `${index}-${review.productId}-${review.writer}`;
                        const isExpanded = expandedReviews.has(reviewId);

                        return (
                            <ReviewItem
                                key={reviewId}
                                review={review}
                                reviewId={reviewId}
                                isVisibleProductInfo={isVisibleProductInfo}
                                isExpanded={isExpanded}
                                onImageClick={handleImageClick}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
