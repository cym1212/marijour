import type { Qna } from '@/types/qna';

export const QNA_MOCK_DATA: Qna[] = [
    {
        id: 1,
        title: '레고트 누프레임 커플잔 2P',
        content: '이 상품의 재입고 일정이 궁금합니다.',
        writer: 'user1',
        createAt: '2024-12-15',
        status: '답변 대기',
        category: '상품',
        comments: [
            {
                qnaId: 1,
                content: '안녕하세요, 고객님. 재입고 일정은 다음 주 중으로 예정되어 있습니다.',
                writer: 'admin',
                createAt: '2024-12-16',
            },
        ],
    },
];
