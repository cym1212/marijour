export type QnaCategory = '상품' | '주문/결제' | '배송' | '취소/교환/반품' | '기타';

export interface Qna {
    id: number;
    title: string;
    status: '답변 대기' | '답변 완료';
    category: QnaCategory;
    content: string;
    writer: string;
    createAt: string;
    comments: Answer[] | [];
}

export interface Answer {
    qnaId: number;
    content: string;
    writer: string;
    createAt: string;
}

export interface QnaListProps {
    qnas: Qna[];
}

export interface QnaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (qnaData: Partial<Qna>) => void;
}
