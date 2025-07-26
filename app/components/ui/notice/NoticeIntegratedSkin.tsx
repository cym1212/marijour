import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// CSS import for webpack bundling
import './notice-skin-scoped.css';

// GSAP 플러그인 등록
if (typeof window !== 'undefined' && gsap) {
    gsap.registerPlugin(ScrollTrigger);
}

// ComponentSkinProps 인터페이스 - Board API 준수
interface ComponentSkinProps {
    data?: {
        // 기본 정보
        id?: string;
        style?: React.CSSProperties;
        componentProps?: object;
        
        // 게시판 모드 (중요!)
        mode?: 'list' | 'detail' | 'new' | 'edit';
        
        // 게시판 설정
        boardTitle?: string;
        boardCode?: string;
        selectedBoardId?: number | string | null;
        categoryId?: number | string | null;
        postId?: number | string | null;
        
        // 표시 설정
        showNewButton?: boolean;
        showEditButton?: boolean;
        showDeleteButton?: boolean;
        showCommentButton?: boolean;
        
        // 게시글 목록 데이터
        posts?: Array<{
            id: number;
            title: string;
            content: string;
            createdAt: string;
            views?: number;
            viewCount?: number;
            userId?: number | string;
            administratorId?: number;
            author?: string;
            user?: {
                name: string;
            };
        }>;
        postsLoading?: boolean;
        
        // 게시글 상세 데이터
        postDetail?: {
            post?: {
                id: number;
                title: string;
                content: string;
                createdAt: string;
                views?: number;
                viewCount?: number;
                userId?: number | string;
                administratorId?: number;
                author?: string;
                user?: {
                    name: string;
                };
                originalBlock?: any;
                totalComments?: number;
                permissions?: {
                    canEdit: boolean;
                    canDelete: boolean;
                    canComment: boolean;
                };
                children?: Array<any>;
            };
            permissions?: {
                canEdit: boolean;
                canDelete: boolean;
                canComment: boolean;
            };
        } | null;
        postDetailLoading?: boolean;
        
        // 페이징 정보
        pagination?: {
            currentPage: number;
            totalPages: number;
            totalCount: number;
            perPage: number;
        };
        currentPage?: number;
        
        // 댓글 관련
        paginatedComments?: Array<any>;
        totalCommentPages?: number;
        currentCommentPage?: number;
        
        // 폼 데이터
        formData?: {
            title: string;
            content: string;
            originalBlock: any | null;
        };
        
        // 사용자 정보
        currentUser?: any;
        isUserLoggedIn?: boolean;
        isAdminLoggedIn?: boolean;
        
        // 디바이스 정보
        currentDevice?: 'mobile' | 'pc';
        isFinappMode?: boolean;
        
        // 권한 정보
        postsData?: {
            permissions?: {
                canWrite: boolean;
                canEdit: boolean;
                canDelete: boolean;
                canComment: boolean;
            };
        };
        
        // 테마
        theme?: {
            primary?: string;
            primaryDark?: string;
            secondary?: string;
            textColor?: string;
            backgroundColor?: string;
        };
    };
    
    actions?: {
        // 네비게이션
        navigateToList?: () => void;
        navigateToDetail?: (postId: number) => void;
        navigateToNew?: (boardCode?: string) => void;
        
        // 모드 변경
        setBoardMode?: (mode: 'list' | 'detail' | 'new' | 'edit') => void;
        
        // 페이징
        handlePageChange?: (page: number) => void;
        handleCommentPageChange?: (page: number) => void;
        
        // 게시글 CRUD
        handleSavePost?: () => void;
        handleDeletePost?: () => void;
        confirmDeletePost?: () => void;
        cancelDeletePost?: () => void;
        setShowDeleteModal?: (show: boolean) => void;
        
        // 폼 핸들링
        handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleEditorChange?: (content: string, originalBlock?: any) => void;
        setFormData?: (data: { title: string; content: string; originalBlock?: any }) => void;
        
        // 취소 액션
        handleCancelNew?: () => void;
        handleCancelEdit?: () => void;
        
        // 댓글 CRUD
        handleCommentSubmit?: () => void;
        handleCommentChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        handleEditComment?: (commentId: number, content: string) => void;
        handleUpdateComment?: () => void;
        handleDeleteComment?: (commentId: number) => void;
        handleCancelEditComment?: () => void;
        handleEditingCommentChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    };
    
    options?: any;
    mode?: 'production' | 'preview' | 'editor';
    
    utils?: {
        t?: (key: string) => string;
        navigate?: (path: string) => void;
        formatCurrency?: (amount: number, currency?: string) => string;
        formatDate?: (date: string | Date, format?: string) => string;
        getAssetUrl?: (path: string) => string;
        cx?: (...classes: (string | undefined | null | false)[]) => string;
    };
    
    app?: {
        user?: any | null;
        settings?: Record<string, any>;
        theme?: any;
        company?: {
            id: number;
        };
    };
    
    editor?: {
        isSelected?: boolean;
        onSelect?: () => void;
        onEdit?: () => void;
        onDelete?: () => void;
        dragHandleProps?: any;
    };
}

// Mock 데이터 (번들에 포함 - 내부 사용)
const NOTICE_MOCK_DATA = [
    {
        id: 1,
        title: '신규 상품 출시 안내',
        content: '새로운 프리미엄 라인의 상품들이 출시되었습니다. 특별 할인 혜택과 함께 만나보세요.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-12-15',
        views: 150,
        viewCount: 150,
        user: { name: '관리자' }
    },
    {
        id: 2,
        title: '배송 지연 안내',
        content: '연말 물량 증가로 인해 일부 지역의 배송이 1-2일 지연될 수 있습니다. 양해 부탁드립니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-12-10',
        views: 203,
        viewCount: 203,
        user: { name: '관리자' }
    },
    {
        id: 3,
        title: '고객센터 운영시간 변경 안내',
        content: '12월 25일부터 고객센터 운영시간이 평일 09:00~17:00로 변경됩니다.',
        userId: 2,
        createdAt: '2024-12-08',
        views: 87,
        viewCount: 87,
        user: { name: '매니저' }
    },
    {
        id: 4,
        title: '회원 등급 혜택 개편 안내',
        content: '더 나은 혜택 제공을 위해 회원 등급 시스템이 개편됩니다. 기존 회원님들의 등급은 유지됩니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-12-05',
        views: 342,
        viewCount: 342,
        user: { name: '관리자' }
    },
    {
        id: 5,
        title: '겨울 시즌 특가 세일 시작',
        content: '겨울 상품 최대 50% 할인! 12월 31일까지 진행되니 놓치지 마세요.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-12-01',
        views: 567,
        viewCount: 567,
        user: { name: '관리자' }
    },
    {
        id: 6,
        title: '개인정보 처리방침 변경 안내',
        content: '개인정보 보호법 개정에 따라 개인정보 처리방침이 일부 변경되었습니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-11-28',
        views: 129,
        viewCount: 129,
        user: { name: '관리자' }
    },
    {
        id: 7,
        title: '시스템 점검 안내',
        content: '11월 30일 새벽 02:00~06:00 시스템 점검으로 인해 서비스 이용이 제한됩니다.',
        userId: 2,
        createdAt: '2024-11-25',
        views: 298,
        viewCount: 298,
        user: { name: '매니저' }
    },
    {
        id: 8,
        title: '신규 결제 수단 추가',
        content: '카카오페이, 네이버페이 결제 서비스가 추가되었습니다. 더 편리하게 이용하세요.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-11-20',
        views: 432,
        viewCount: 432,
        user: { name: '관리자' }
    },
    {
        id: 9,
        title: '블랙프라이데이 특별 이벤트',
        content: '11월 29일 하루 한정! 전 상품 추가 20% 할인 쿠폰을 지급해드립니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-11-18',
        views: 789,
        viewCount: 789,
        user: { name: '관리자' }
    },
    {
        id: 10,
        title: '반품/교환 정책 개선 안내',
        content: '고객 만족도 향상을 위해 반품/교환 기간이 7일에서 14일로 연장됩니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-11-15',
        views: 234,
        viewCount: 234,
        user: { name: '관리자' }
    },
    {
        id: 11,
        title: '모바일 앱 업데이트 안내',
        content: '더 빠르고 안정적인 서비스를 위해 모바일 앱이 업데이트되었습니다.',
        userId: 3,
        createdAt: '2024-11-12',
        views: 187,
        viewCount: 187,
        user: { name: '개발팀' }
    },
    {
        id: 12,
        title: '리뷰 작성 이벤트 당첨자 발표',
        content: '10월 리뷰 작성 이벤트 당첨자를 발표합니다. 당첨자분들께는 개별 연락드리겠습니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-11-08',
        views: 456,
        viewCount: 456,
        user: { name: '관리자' }
    },
    {
        id: 13,
        title: '추석 연휴 배송 및 고객센터 운영 안내',
        content: '추석 연휴 기간 동안의 배송 일정과 고객센터 운영시간을 안내드립니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-09-10',
        views: 678,
        viewCount: 678,
        user: { name: '관리자' }
    },
    {
        id: 14,
        title: '여름 신상품 론칭 기념 이벤트',
        content: '시원한 여름을 위한 신상품 출시! 론칭 기념 특가로 만나보세요.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-06-15',
        views: 892,
        viewCount: 892,
        user: { name: '관리자' }
    },
    {
        id: 15,
        title: '회원가입 축하 쿠폰 정책 변경',
        content: '신규 회원가입 시 지급되는 쿠폰 혜택이 개선되었습니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-05-20',
        views: 321,
        viewCount: 321,
        user: { name: '관리자' }
    },
    {
        id: 16,
        title: '어린이날 특별 할인 이벤트',
        content: '5월 5일 어린이날을 맞아 키즈 상품 특별 할인 이벤트를 진행합니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-05-01',
        views: 543,
        viewCount: 543,
        user: { name: '관리자' }
    },
    {
        id: 17,
        title: '봄맞이 대청소 이벤트',
        content: '집안 정리에 필요한 모든 용품을 한 번에! 봄맞이 특가 이벤트입니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-03-15',
        views: 412,
        viewCount: 412,
        user: { name: '관리자' }
    },
    {
        id: 18,
        title: '신규 브랜드 입점 안내',
        content: '고객님들이 사랑하는 인기 브랜드들이 새롭게 입점했습니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-02-28',
        views: 765,
        viewCount: 765,
        user: { name: '관리자' }
    },
    {
        id: 19,
        title: '설날 연휴 서비스 운영 안내',
        content: '설날 연휴 기간 동안의 주문, 배송, 고객센터 운영 일정을 안내드립니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-02-05',
        views: 589,
        viewCount: 589,
        user: { name: '관리자' }
    },
    {
        id: 20,
        title: '2024년 새해 인사 및 이벤트',
        content: '새해 복 많이 받으세요! 2024년을 맞아 특별한 신년 이벤트를 준비했습니다.',
        userId: 1,
        administratorId: 1,
        createdAt: '2024-01-01',
        views: 1024,
        viewCount: 1024,
        user: { name: '관리자' }
    },
];

// ColorButton 컴포넌트 (외부 의존성 제거)
const ColorButton: React.FC<{
    colorType?: string;
    ariaLabel?: string;
    onClick?: () => void;
    tailwind?: string;
    children: React.ReactNode;
}> = ({ onClick, children, tailwind = '', colorType = 'white' }) => {
    const getButtonStyle = () => {
        if (colorType === 'black') {
            return 'bg-black text-white border-black hover:bg-gray-800';
        }
        return 'bg-white text-black border-black hover:bg-gray-50';
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center px-12 py-3 text-sm font-medium transition-colors border ${getButtonStyle()} ${tailwind}`}
        >
            {children}
        </button>
    );
};

// Pagination 컴포넌트는 원본과 동일하게 사용
const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    maxVisiblePages: number;
    onPageChange: (page: number) => void;
}> = () => {
    // 원본 NoticeSkin에서는 외부 Pagination 컴포넌트를 사용하지만
    // 독립적인 버전을 위해 null 반환
    return null;
};

// NoData 컴포넌트 (외부 의존성 제거)
const NoData: React.FC<{
    icon?: React.ReactNode;
    title: string;
    description: string;
}> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-16">
        {icon && <div className="mb-4 text-gray-400">{icon}</div>}
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

// NoticeIcon 컴포넌트
const NoticeIcon: React.FC<{ tailwind?: string }> = ({ tailwind = 'w-12 h-12' }) => (
    <svg className={tailwind} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// ArrowIcon 컴포넌트 (페이징용)
const ArrowIcon: React.FC<{ rotate?: string; tailwind?: string }> = ({ rotate = '0', tailwind = 'w-4 h-4' }) => (
    <svg 
        className={tailwind} 
        style={{ transform: `rotate(${rotate}deg)` }}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

// DubbleArrowIcon 컴포넌트 (첫/마지막 페이지용)
const DubbleArrowIcon: React.FC<{ rotate?: string; tailwind?: string }> = ({ rotate = '0', tailwind = 'w-4 h-4' }) => (
    <svg 
        className={tailwind} 
        style={{ transform: `rotate(${rotate}deg)` }}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
);

// HTML 태그 제거 유틸리티 함수
const stripHtmlTags = (html: string): string => {
    // 임시 div 엘리먼트를 생성하여 HTML을 파싱
    if (typeof window !== 'undefined') {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
    // SSR 환경에서는 정규식으로 처리
    return html
        .replace(/<[^>]*>/g, '') // 모든 HTML 태그 제거
        .replace(/&nbsp;/g, ' ') // &nbsp;를 공백으로
        .replace(/&amp;/g, '&')  // &amp;를 &로
        .replace(/&lt;/g, '<')   // &lt;를 <로
        .replace(/&gt;/g, '>')   // &gt;를 >로
        .replace(/&quot;/g, '"') // &quot;를 "로
        .replace(/&#039;/g, "'") // &#039;를 '로
        .trim();
};

/**
 * NoticeIntegrated - 공지사항 리스트 & 상세 통합 스킨 컴포넌트
 * Board API를 사용하는 UMD 번들용 컴포넌트
 */
export const NoticeIntegrated: React.FC<ComponentSkinProps> = (props) => {
    const { 
        data = {}, 
        actions = {}, 
        options = {},
        utils = {},
        app = {},
        mode: envMode = 'production'
    } = props || {};
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAnimated, setIsAnimated] = useState(false);
    
    // Board API 데이터 사용
    const {
        mode = 'list',
        posts = NOTICE_MOCK_DATA,
        postsLoading = false,
        postDetail = null,
        postDetailLoading = false,
        pagination = { currentPage: 1, totalPages: 1, totalCount: 0, perPage: 10 },
        currentPage = 1,
        theme = {},
        currentUser = null,
        boardTitle = '공지사항',
        boardCode = 'notice',
        showNewButton = false,
        showEditButton = false,
        showDeleteButton = false,
        postsData = {}
    } = data;

    // 다국어 지원
    const t = utils.t || ((key: string) => key);

    // Board API actions 사용
    const {
        navigateToDetail = () => console.log('Navigate to detail'),
        navigateToList = () => console.log('Navigate to list'),
        setBoardMode = () => console.log('Set board mode'),
        handlePageChange = () => console.log('Page change'),
        setPostId = () => console.log('Set post id')
    } = actions || {};
    

    const {
        // 리스트 옵션
        showPagination = true,
        maxVisiblePages = 5,
        showWriter = true,
        showDate = true,
        showContent = true,
        contentLineClamp = 2,
        
        // 상세 옵션
        showBackButton = true,
        showShareButton = false,
        showPrintButton = false,
        
        // 공통 옵션
        titleFontSize = mode === 'list' ? '0.875rem' : '1.125rem',
        titleFontWeight = '700',
        contentFontSize = '1rem',
        lineHeight = '1.625',
        buttonStyle = 'outline',
        animation = true,
        animationDuration = 0.9
    } = options;
    
    // 작성자 이름 반환 - Board API 로직 사용
    const getAuthorName = (item: any) => {
        if (item.administratorId) return t('관리자');
        
        if (currentUser && item.userId) {
            const isCurrentUser = 
                (currentUser.id && currentUser.id.toString() === item.userId.toString()) ||
                (currentUser.userId && currentUser.userId.toString() === item.userId.toString());
            
            if (isCurrentUser) return t('나');
        }
        
        return item.user?.name || item.author || t('익명');
    };
    
    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        if (utils.formatDate) {
            return utils.formatDate(dateString);
        }
        return new Date(dateString).toLocaleDateString();
    };

    // 컨테이너 애니메이션
    useEffect(() => {
        if (animation && containerRef.current && !isAnimated) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: mode === 'list' ? 0 : 20 },
                { 
                    opacity: 1, 
                    y: 0,
                    duration: animationDuration,
                    ease: 'power2.out',
                    onComplete: () => setIsAnimated(true)
                }
            );
        }
    }, [animation, animationDuration, mode, isAnimated]);

    // 리스트 아이템 애니메이션
    useEffect(() => {
        if (animation && mode === 'list' && isAnimated && posts.length > 0) {
            const noticeItems = gsap.utils.toArray('.notice-skin-item') as Element[];
            
            if (noticeItems.length === 0) return;

            // 초기에 모든 아이템 숨기기
            gsap.set(noticeItems, { opacity: 0 });

            ScrollTrigger.batch(noticeItems, {
                start: 'top 95%',
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        opacity: 1,
                        duration: animationDuration,
                        stagger: 0.1,
                        ease: 'power2.out',
                    }),
            });

            return () => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            };
        }
    }, [animation, animationDuration, mode, posts, isAnimated]);

    // 로딩 상태
    if (mode === 'list' && postsLoading) {
        return (
            <div className="notice-skin-loading">
                <div className="loading-spinner"></div>
                <p>{t('게시글을 불러오는 중...')}</p>
            </div>
        );
    }
    
    if (mode === 'detail' && postDetailLoading) {
        return (
            <div className="notice-skin-loading">
                <div className="loading-spinner"></div>
                <p>{t('게시글을 불러오는 중...')}</p>
            </div>
        );
    }

    // 테마 스타일 적용
    const containerStyle: React.CSSProperties = {
        backgroundColor: theme.backgroundColor || 'transparent',
        color: theme.textColor || 'inherit'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: titleFontSize,
        fontWeight: titleFontWeight as any
    };

    const contentStyle: React.CSSProperties = {
        fontSize: contentFontSize,
        lineHeight: lineHeight
    };

    // 리스트 뷰 렌더링
    const renderListView = () => (
        <>
            {posts && posts.length > 0 ? (
                <div className="notice-skin-list">
                    <ul>
                        {posts.map((post) => (
                            <li
                                key={post.id}
                                className="notice-skin-item"
                            >
                                <button
                                    onClick={() => {
                                        // Preview/Editor 모드에서는 setBoardMode + setPostId 사용
                                        if (envMode === 'preview' || envMode === 'editor') {
                                            if (actions.setPostId) {
                                                actions.setPostId(post.id);
                                            }
                                            actions.setBoardMode?.('detail');
                                        }
                                        // Production 모드에서는 navigateToDetail 사용
                                        else {
                                            navigateToDetail(post.id);
                                        }
                                    }}
                                    className="notice-skin-item-button"
                                >
                                    <div className="notice-skin-item-content">
                                        <h3 className="notice-skin-item-title" style={titleStyle}>
                                            {post.title}
                                        </h3>
                                        {showContent && (
                                            <p 
                                                className={`notice-skin-item-text line-clamp-${contentLineClamp}`}
                                                style={{ fontSize: '0.75rem', lineHeight: '1.25rem' }}
                                            >
                                                {stripHtmlTags(post.content)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="notice-skin-item-meta">
                                        {showWriter && (
                                            <span className="notice-skin-item-writer">{getAuthorName(post)}</span>
                                        )}
                                        {showDate && (
                                            <span className="notice-skin-item-date">{formatDate(post.createdAt)}</span>
                                        )}
                                        {showDate && (post.views || post.viewCount) && (
                                            <span className="notice-skin-item-views">
                                                {t('조회')} {post.views || post.viewCount || 0}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <NoData
                    icon={<NoticeIcon tailwind="w-full h-full" />}
                    title={t('게시글이 없습니다.')}
                    description={t('새로운 게시글이 등록되면 여기에 표시됩니다.')}
                />
            )}

            {/* 페이지네이션 */}
            {showPagination && pagination && pagination.totalPages > 1 && (
                <nav className="notice-skin-pagination" aria-label="페이지네이션">
                    {/* 첫 페이지로 이동 */}
                    <button
                        className="notice-skin-pagination-nav"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.currentPage === 1}
                        aria-label="첫 페이지로 이동"
                    >
                        <DubbleArrowIcon rotate="180" tailwind="w-[16px] h-[16px]" />
                    </button>

                    {/* 이전 페이지 */}
                    <button
                        className="notice-skin-pagination-nav"
                        onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                        disabled={pagination.currentPage === 1}
                        aria-label="이전 페이지"
                    >
                        <ArrowIcon rotate="180" tailwind="w-[16px] h-[16px]" />
                    </button>

                    {/* 페이지 번호들 */}
                    <div className="notice-skin-pagination-numbers">
                        {(() => {
                            const pages = [];
                            const current = pagination.currentPage;
                            const total = pagination.totalPages;
                            const halfVisible = Math.floor(maxVisiblePages / 2);
                            
                            let startPage = current - halfVisible;
                            let endPage = current + halfVisible;
                            
                            // 시작 페이지가 1보다 작으면 조정
                            if (startPage < 1) {
                                startPage = 1;
                                endPage = maxVisiblePages;
                            }
                            
                            // 끝 페이지가 전체 페이지보다 크면 조정
                            if (endPage > total) {
                                endPage = total;
                                startPage = total - maxVisiblePages + 1;
                                if (startPage < 1) startPage = 1;
                            }
                            
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        className={`notice-skin-pagination-btn ${current === i ? 'notice-skin-pagination-active' : ''}`}
                                        onClick={() => handlePageChange(i)}
                                        aria-label={`${i}페이지로 이동`}
                                        aria-current={current === i ? 'page' : undefined}
                                    >
                                        {i}
                                    </button>
                                );
                            }
                            
                            return pages;
                        })()}
                    </div>

                    {/* 다음 페이지 */}
                    <button
                        className="notice-skin-pagination-nav"
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                        disabled={pagination.currentPage === pagination.totalPages}
                        aria-label="다음 페이지"
                    >
                        <ArrowIcon rotate="0" tailwind="w-[16px] h-[16px]" />
                    </button>

                    {/* 마지막 페이지로 이동 */}
                    <button
                        className="notice-skin-pagination-nav"
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        aria-label="마지막 페이지로 이동"
                    >
                        <DubbleArrowIcon rotate="0" tailwind="w-[16px] h-[16px]" />
                    </button>
                </nav>
            )}
        </>
    );

    // 상세 뷰 렌더링
    const renderDetailView = () => {
        const post = postDetail?.post || postDetail;
        const permissions = post?.permissions || postDetail?.permissions || {};
        
        return (
            <>
                {post ? (
                    <div className="notice-skin-detail">
                        <div className="notice-skin-detail-info">
                            <h3 className="notice-skin-detail-title" style={titleStyle}>
                                {post.title}
                            </h3>
                            <div className="notice-skin-detail-meta">
                                <span className="notice-skin-detail-writer">{getAuthorName(post)}</span>
                                <span className="notice-skin-detail-date">{formatDate(post.createdAt)}</span>
                                <span className="notice-skin-detail-views">
                                    {t('조회')} {post.views || post.viewCount || 0}
                                </span>
                            </div>
                        </div>
                        
                        <div className="notice-skin-detail-body">
                            <div 
                                className="notice-skin-detail-text" 
                                style={contentStyle}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        <div className="notice-skin-detail-actions">
                            {showBackButton && (
                                <ColorButton
                                    colorType={buttonStyle === 'filled' ? 'black' : 'white'}
                                    ariaLabel={t('목록')}
                                    onClick={() => {
                                        // Preview/Editor 모드에서는 setBoardMode 사용
                                        if (envMode === 'preview' || envMode === 'editor') {
                                            actions.setBoardMode?.('list');
                                        }
                                        // Production 모드에서는 navigateToList 사용
                                        else {
                                            actions.navigateToList?.();
                                        }
                                    }}
                                    tailwind="notice-skin-button"
                                >
                                    {t('목록')}
                                </ColorButton>
                            )}
                            
                            
                            {showShareButton && (
                                <ColorButton
                                    colorType="white"
                                    ariaLabel={t('공유하기')}
                                    onClick={() => {
                                        if (typeof navigator !== 'undefined' && navigator.share) {
                                            navigator.share({
                                                title: post.title,
                                                text: post.content.substring(0, 100) + '...',
                                                url: window.location.href
                                            });
                                        }
                                    }}
                                    tailwind="notice-skin-button"
                                >
                                    {t('공유하기')}
                                </ColorButton>
                            )}
                            
                            {showPrintButton && (
                                <ColorButton
                                    colorType="white"
                                    ariaLabel={t('인쇄하기')}
                                    onClick={() => window.print()}
                                    tailwind="notice-skin-button"
                                >
                                    {t('인쇄하기')}
                                </ColorButton>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="notice-skin-empty">
                        <NoData
                            title={t('게시글을 찾을 수 없습니다.')}
                            description={t('요청하신 게시글이 존재하지 않거나 삭제되었습니다.')}
                        />
                    </div>
                )}
            </>
        );
    };

    return (
        <div 
            ref={containerRef}
            className="notice-skin-container" 
            style={containerStyle}
            data-view={mode}
        >
            <section className="notice-skin-wrapper">
                <div className="notice-skin-header">
                    <h2 className="notice-skin-page-title">{boardTitle || t('공지사항')}</h2>
                    {/*{mode === 'list' && postsData?.permissions?.canWrite && showNewButton && (*/}
                    {/*    <ColorButton*/}
                    {/*        colorType="black"*/}
                    {/*        ariaLabel={t('새 글쓰기')}*/}
                    {/*        onClick={() => actions?.navigateToNew?.(data.boardCode)}*/}
                    {/*        tailwind="notice-skin-new-button"*/}
                    {/*    >*/}
                    {/*        {t('새 글쓰기')}*/}
                    {/*    </ColorButton>*/}
                    {/*)}*/}
                </div>

                <div className="notice-skin-content">
                    {mode === 'list' ? renderListView() : mode === 'detail' ? renderDetailView() : null}
                </div>
            </section>
        </div>
    );
};

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(NoticeIntegrated as any).SAMPLE_DATA = NOTICE_MOCK_DATA;

// 웹빌더 통합을 위한 기본 export
export default NoticeIntegrated;