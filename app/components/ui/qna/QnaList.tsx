import { Link } from 'react-router';

import { CommentIcon } from '@/components/icons';

import type { QnaListProps } from '@/types/qna';

export function QnaList({ qnas }: QnaListProps) {
    return (
        <ul className="w-full border-t border-black/10">
            {qnas.map((qna, index) => (
                <li
                    className="border-b border-black/10 py-4"
                    key={qna.id}
                >
                    <Link
                        className="block"
                        to={`/my-page/qna/detail/${qna.id}`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <p className="flex items-center gap-2 font-bold">
                                <span className={`text-sm ${qna.status === '답변 대기' ? 'text-black/40' : 'text-primary'}`}>{qna.status}</span>
                                <span>{qna.category}</span>
                            </p>
                            <p className="text-sm text-black/60">{qna.createAt}</p>
                        </div>
                        <div className="mb-3">
                            <p className="flex items-center gap-1 text-xs text-black/40">
                                <span>{qna.title}</span>
                            </p>
                        </div>
                        <div className="mb-3">
                            <p className="line-clamp-1">{qna.content}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black/80">
                            <CommentIcon tailwind="w-[16px] h-[16px]" />
                            <p>댓글 {qna.comments.length}</p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
