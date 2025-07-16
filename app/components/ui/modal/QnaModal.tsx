import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button';
import { LabelInput, TextInput, SelectBox, TextArea, WarningLabel } from '@/components/ui/input';
import { CloseIcon } from '@/components/icons';

import type { QnaCategory, QnaModalProps } from '@/types/qna';

gsap.registerPlugin(useGSAP);

/**
 * QnaModal 컴포넌트 - Q&A 작성 모달
 *
 * 기능:
 * - 고객 문의 작성 모달
 * - 문의 카테고리별 다른 플레이스홀더 제공
 * - 폼 유효성 검사 포함
 *
 * 주의사항:
 * - 현재 폼 유효성 검사는 임시 검사라 내부 기획에 따라 재정의 필요
 *
 * 파라미터:
 * @param isOpen - 모달 표시 여부
 * @param onClose - 모달 닫기 핸들러
 * @param onSubmit - 문의 제출 핸들러
 */

const QNA_CATEGORIES: { value: QnaCategory; label: string; titlePlaceholder: string; contentPlaceholder: string }[] = [
    {
        value: '상품',
        label: '상품 문의',
        titlePlaceholder: '상품명을 입력해주세요',
        contentPlaceholder: '상품에 대해 궁금한 내용을 자세히 입력해주세요',
    },
    {
        value: '주문/결제',
        label: '주문/결제 문의',
        titlePlaceholder: '주문번호를 입력해주세요',
        contentPlaceholder: '주문이나 결제 관련 문의 내용을 자세히 입력해주세요',
    },
    {
        value: '배송',
        label: '배송 문의',
        titlePlaceholder: '운송장번호를 입력해주세요',
        contentPlaceholder: '배송 관련 문의 내용을 자세히 입력해주세요',
    },
    {
        value: '취소/교환/반품',
        label: '취소/교환/반품 문의',
        titlePlaceholder: '취소/교환/반품 사유를 입력해주세요',
        contentPlaceholder: '취소, 교환, 반품 관련 문의 내용을 자세히 입력해주세요',
    },
    {
        value: '기타',
        label: '기타 문의',
        titlePlaceholder: '문의 제목을 입력해주세요',
        contentPlaceholder: '기타 문의 내용을 자세히 입력해주세요',
    },
];

/**
 * QnaModal 컴포넌트 - 문의하기 모달
 *
 * Props:
 * - isOpen: boolean - 모달 표시 여부
 * - onClose: () => void - 모달 닫기 핸들러
 * - onSubmit: (qnaData: Partial<Qna>) => void - 문의 제출 핸들러
 */
export function QnaModal({ isOpen, onClose, onSubmit }: QnaModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<QnaCategory | ''>('');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');

    // 폼 초기화 함수
    const resetForm = () => {
        setSelectedCategory('');
        setTitle('');
        setContent('');
        setError('');
    };

    // 모달 닫기 핸들러 (폼 초기화 포함)
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // 문의 유형 선택 핸들러
    const handleCategorySelect = (value: string) => {
        setSelectedCategory(value as QnaCategory);
        if (error) {
            setError('');
        }
    };

    // 제목 입력 핸들러
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        if (error) {
            setError('');
        }
    };

    // 문의 내용 입력 핸들러
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);
        if (error) {
            setError('');
        }
    };

    // 문의 제출 핸들러
    const handleSubmit = () => {
        if (!selectedCategory) {
            setError('문의 유형을 선택해주세요.');
            return;
        }

        if (!title.trim()) {
            setError('문의 제목을 입력해주세요.');
            return;
        }

        if (!content.trim()) {
            setError('문의 내용을 입력해주세요.');
            return;
        }

        if (content.trim().length < 10) {
            setError('문의 내용을 10자 이상 입력해주세요.');
            return;
        }

        // 문의 제출
        onSubmit({
            category: selectedCategory,
            content: `제목: ${title.trim()}\n\n${content.trim()}`,
            status: '답변 대기',
            writer: '홍길동', // 실제로는 로그인한 사용자 정보
            createAt: new Date().toISOString().split('T')[0],
            comments: [],
        });

        // 폼 초기화 및 모달 닫기
        handleClose();
    };

    // 모달 배경 클릭 시 닫기
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // 모달 fade-in-out 애니메이션
    useGSAP(() => {
        const container = document.querySelector('.qnaModalContainer');

        if (isOpen) {
            gsap.to(container, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    }, [isOpen]);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // 모달이 열릴 때 스크롤 방지
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]); // onClose 의존성 제거 (handleClose 사용)

    // 선택된 카테고리의 placeholder 가져오기
    const getTitlePlaceholder = () => {
        const category = QNA_CATEGORIES.find((cat) => cat.value === selectedCategory);
        return category?.titlePlaceholder || '문의 제목을 입력해주세요';
    };

    const getContentPlaceholder = () => {
        const category = QNA_CATEGORIES.find((cat) => cat.value === selectedCategory);
        return category?.contentPlaceholder || '문의하실 내용을 입력해주세요';
    };

    // 폼 유효성 검사 (등록 버튼 활성화 조건)
    const isFormValid = selectedCategory && title.trim() && content.trim();

    if (!isOpen) return null;

    return (
        <div className="qnaModalContainer fixed top-0 left-0 w-full h-full overflow-hidden z-10000 opacity-0">
            <div
                className="qnaModalOverlay fixed bg-black/60 w-full h-full"
                onClick={handleOverlayClick}
            ></div>
            <div className="qnaModalContent fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-black/10">
                    <h2 className="text-2xl font-serif">문의</h2>
                    <button
                        onClick={handleClose}
                        className="closeBtn p-3.5"
                        aria-label="모달 닫기"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="p-5 space-y-6">
                    {/* 문의 유형 선택 */}
                    <LabelInput
                        label="문의 유형"
                        htmlFor="category"
                        validateContent={error && !selectedCategory && <WarningLabel message="문의 유형을 선택해주세요." />}
                    >
                        <SelectBox
                            name="category"
                            id="category"
                            value={selectedCategory}
                            placeholder="문의 유형을 선택해주세요"
                            options={QNA_CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label }))}
                            required
                            onChange={handleCategorySelect}
                        />
                    </LabelInput>

                    {/* 문의 제목 입력 (유형 선택 시에만 표시) */}
                    {selectedCategory && (
                        <LabelInput
                            label="문의 제목"
                            htmlFor="title"
                            validateContent={error && !title.trim() && <WarningLabel message="문의 제목을 입력해주세요." />}
                        >
                            <TextInput
                                type="text"
                                name="title"
                                id="title"
                                placeholder={getTitlePlaceholder()}
                                value={title}
                                onChange={handleTitleChange}
                                required
                            />
                        </LabelInput>
                    )}

                    {/* 문의 내용 입력 (항상 표시) */}
                    <LabelInput
                        label="문의 내용"
                        htmlFor="content"
                        validateContent={error && !content.trim() && <WarningLabel message="문의 내용을 입력해주세요." />}
                    >
                        <TextArea
                            name="content"
                            id="content"
                            placeholder={getContentPlaceholder()}
                            value={content}
                            onChange={handleContentChange}
                            tailwind="min-h-[150px] resize-none"
                            maxLength={5000}
                            required
                        />
                    </LabelInput>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                {/* 모달 푸터 */}
                <div className="p-5 border-t border-black/10">
                    <ColorButton
                        type="button"
                        colorType={isFormValid ? 'primary' : 'grayLine'}
                        onClick={handleSubmit}
                        tailwind="w-full py-3"
                        disabled={!isFormValid}
                    >
                        등록
                    </ColorButton>
                </div>
            </div>
        </div>
    );
}
