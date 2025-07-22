import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ColorButton } from '@/components/ui/button/ColorButton';
import { Pagination } from '@/components/ui/Pagination';
import { NoData } from '@/components/ui/NoData';
import { NoticeIcon } from '@/components/icons';
import type { Notice } from '@/types/notice';

// CSS import for webpack bundling
import './notice-skin-scoped.css';

// GSAP 플러그인 등록
if (typeof window !== 'undefined' && gsap) {
    gsap.registerPlugin(ScrollTrigger);
}

// Mock 데이터 (번들에 포함 - 내부 사용)
const NOTICE_MOCK_DATA: Notice[] = [
    {
        id: 1,
        title: '신규 상품 출시 안내',
        content: '새로운 프리미엄 라인의 상품들이 출시되었습니다. 특별 할인 혜택과 함께 만나보세요.',
        writer: 'admin',
        createAt: '2024-12-15',
    },
    {
        id: 2,
        title: '배송 지연 안내',
        content: '연말 물량 증가로 인해 일부 지역의 배송이 1-2일 지연될 수 있습니다. 양해 부탁드립니다.',
        writer: 'admin',
        createAt: '2024-12-10',
    },
    {
        id: 3,
        title: '고객센터 운영시간 변경 안내',
        content: '12월 25일부터 고객센터 운영시간이 평일 09:00~17:00로 변경됩니다.',
        writer: 'manager',
        createAt: '2024-12-08',
    },
    {
        id: 4,
        title: '회원 등급 혜택 개편 안내',
        content: '더 나은 혜택 제공을 위해 회원 등급 시스템이 개편됩니다. 기존 회원님들의 등급은 유지됩니다.',
        writer: 'admin',
        createAt: '2024-12-05',
    },
    {
        id: 5,
        title: '겨울 시즌 특가 세일 시작',
        content: '겨울 상품 최대 50% 할인! 12월 31일까지 진행되니 놓치지 마세요.',
        writer: 'admin',
        createAt: '2024-12-01',
    },
    {
        id: 6,
        title: '개인정보 처리방침 변경 안내',
        content: '개인정보 보호법 개정에 따라 개인정보 처리방침이 일부 변경되었습니다.',
        writer: 'admin',
        createAt: '2024-11-28',
    },
    {
        id: 7,
        title: '시스템 점검 안내',
        content: '11월 30일 새벽 02:00~06:00 시스템 점검으로 인해 서비스 이용이 제한됩니다.',
        writer: 'manager',
        createAt: '2024-11-25',
    },
    {
        id: 8,
        title: '신규 결제 수단 추가',
        content: '카카오페이, 네이버페이 결제 서비스가 추가되었습니다. 더 편리하게 이용하세요.',
        writer: 'admin',
        createAt: '2024-11-20',
    },
    {
        id: 9,
        title: '블랙프라이데이 특별 이벤트',
        content: '11월 29일 하루 한정! 전 상품 추가 20% 할인 쿠폰을 지급해드립니다.',
        writer: 'admin',
        createAt: '2024-11-18',
    },
    {
        id: 10,
        title: '반품/교환 정책 개선 안내',
        content: '고객 만족도 향상을 위해 반품/교환 기간이 7일에서 14일로 연장됩니다.',
        writer: 'admin',
        createAt: '2024-11-15',
    },
    {
        id: 11,
        title: '모바일 앱 업데이트 안내',
        content: '더 빠르고 안정적인 서비스를 위해 모바일 앱이 업데이트되었습니다.',
        writer: 'developer',
        createAt: '2024-11-12',
    },
    {
        id: 12,
        title: '리뷰 작성 이벤트 당첨자 발표',
        content: '10월 리뷰 작성 이벤트 당첨자를 발표합니다. 당첨자분들께는 개별 연락드리겠습니다.',
        writer: 'admin',
        createAt: '2024-11-08',
    },
    {
        id: 13,
        title: '추석 연휴 배송 및 고객센터 운영 안내',
        content: '추석 연휴 기간 동안의 배송 일정과 고객센터 운영시간을 안내드립니다.',
        writer: 'admin',
        createAt: '2024-09-10',
    },
    {
        id: 14,
        title: '여름 신상품 론칭 기념 이벤트',
        content: '시원한 여름을 위한 신상품 출시! 론칭 기념 특가로 만나보세요.',
        writer: 'admin',
        createAt: '2024-06-15',
    },
    {
        id: 15,
        title: '회원가입 축하 쿠폰 정책 변경',
        content: '신규 회원가입 시 지급되는 쿠폰 혜택이 개선되었습니다.',
        writer: 'admin',
        createAt: '2024-05-20',
    },
    {
        id: 16,
        title: '어린이날 특별 할인 이벤트',
        content: '5월 5일 어린이날을 맞아 키즈 상품 특별 할인 이벤트를 진행합니다.',
        writer: 'admin',
        createAt: '2024-05-01',
    },
    {
        id: 17,
        title: '봄맞이 대청소 이벤트',
        content: '집안 정리에 필요한 모든 용품을 한 번에! 봄맞이 특가 이벤트입니다.',
        writer: 'admin',
        createAt: '2024-03-15',
    },
    {
        id: 18,
        title: '신규 브랜드 입점 안내',
        content: '고객님들이 사랑하는 인기 브랜드들이 새롭게 입점했습니다.',
        writer: 'admin',
        createAt: '2024-02-28',
    },
    {
        id: 19,
        title: '설날 연휴 서비스 운영 안내',
        content: '설날 연휴 기간 동안의 주문, 배송, 고객센터 운영 일정을 안내드립니다.',
        writer: 'admin',
        createAt: '2024-02-05',
    },
    {
        id: 20,
        title: '2024년 새해 인사 및 이벤트',
        content: '새해 복 많이 받으세요! 2024년을 맞아 특별한 신년 이벤트를 준비했습니다.',
        writer: 'admin',
        createAt: '2024-01-01',
    },
];

// 웹빌더 스킨 Props 인터페이스
interface NoticeSkinProps {
    data?: {
        notices?: Notice[];
        selectedNotice?: Notice | null;
        currentPage?: number;
        totalPages?: number;
        itemsPerPage?: number;
        loading?: boolean;
        view?: 'list' | 'detail';
        theme?: {
            primary?: string;
            primaryDark?: string;
            secondary?: string;
            textColor?: string;
            backgroundColor?: string;
        };
    };
    actions?: {
        handleNoticeClick?: (notice: Notice) => void;
        handlePageChange?: (page: number) => void;
        handleGoBack?: () => void;
        handleShare?: () => void;
        handlePrint?: () => void;
    };
    options?: {
        // 리스트 옵션
        showPagination?: boolean;
        maxVisiblePages?: number;
        showWriter?: boolean;
        showDate?: boolean;
        showContent?: boolean;
        contentLineClamp?: number;
        
        // 상세 옵션
        showBackButton?: boolean;
        showShareButton?: boolean;
        showPrintButton?: boolean;
        
        // 공통 옵션
        titleFontSize?: string;
        titleFontWeight?: string;
        contentFontSize?: string;
        lineHeight?: string;
        buttonStyle?: 'filled' | 'outline' | 'text';
        animation?: boolean;
        animationDuration?: number;
    };
}

/**
 * NoticeSkin - 공지사항 리스트 & 상세 통합 스킨 컴포넌트
 * 독립적으로 사용 가능한 UMD 번들용 컴포넌트
 */
export const NoticeSkin: React.FC<NoticeSkinProps> = ({ 
    data = {}, 
    actions = {}, 
    options = {} 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAnimated, setIsAnimated] = useState(false);
    
    // 데이터가 없으면 내장된 샘플 데이터 사용
    const {
        notices = NOTICE_MOCK_DATA,
        selectedNotice = null,
        currentPage = 1,
        totalPages = Math.ceil(NOTICE_MOCK_DATA.length / 10),
        itemsPerPage = 10,
        loading = false,
        view = 'list',
        theme = {}
    } = data;

    const {
        handleNoticeClick = (notice: Notice) => console.log('Notice clicked:', notice),
        handlePageChange = (page: number) => console.log('Page changed:', page),
        handleGoBack = () => console.log('Go back clicked'),
        handleShare = () => console.log('Share clicked'),
        handlePrint = () => window.print()
    } = actions;

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
        titleFontSize = view === 'list' ? '0.875rem' : '1.125rem',
        titleFontWeight = '700',
        contentFontSize = '1rem',
        lineHeight = '1.625',
        buttonStyle = 'outline',
        animation = true,
        animationDuration = 0.9
    } = options;

    // 컨테이너 애니메이션
    useEffect(() => {
        if (animation && containerRef.current && !isAnimated) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: view === 'list' ? 0 : 20 },
                { 
                    opacity: 1, 
                    y: 0,
                    duration: animationDuration,
                    ease: 'power2.out',
                    onComplete: () => setIsAnimated(true)
                }
            );
        }
    }, [animation, animationDuration, view, isAnimated]);

    // 리스트 아이템 애니메이션
    useEffect(() => {
        if (animation && view === 'list' && isAnimated && notices.length > 0) {
            const noticeItems = gsap.utils.toArray('.notice-skin-item') as Element[];
            
            if (noticeItems.length === 0) return;

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
    }, [animation, animationDuration, view, notices, isAnimated]);

    // 로딩 상태
    if (loading) {
        return (
            <div className="notice-skin-loading">
                <div className="loading-spinner"></div>
                <p>공지사항을 불러오는 중입니다...</p>
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
            {notices.length > 0 ? (
                <div className="notice-skin-list">
                    <ul>
                        {notices.map((notice) => (
                            <li
                                key={notice.id}
                                className={`notice-skin-item ${animation ? 'opacity-0' : ''}`}
                            >
                                <button
                                    onClick={() => handleNoticeClick(notice)}
                                    className="notice-skin-item-button"
                                >
                                    <div className="notice-skin-item-content">
                                        <h3 className="notice-skin-item-title" style={titleStyle}>
                                            {notice.title}
                                        </h3>
                                        {showContent && (
                                            <p 
                                                className={`notice-skin-item-text line-clamp-${contentLineClamp}`}
                                                style={{ fontSize: '0.75rem', lineHeight: '1.25rem' }}
                                            >
                                                {notice.content}
                                            </p>
                                        )}
                                    </div>
                                    <div className="notice-skin-item-meta">
                                        {showWriter && (
                                            <span className="notice-skin-item-writer">{notice.writer}</span>
                                        )}
                                        {showDate && (
                                            <span className="notice-skin-item-date">{notice.createAt}</span>
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
                    title="등록된 공지사항이 없습니다"
                    description="새로운 공지사항이 등록되면 여기에 표시됩니다."
                />
            )}

            {/* 페이지네이션 */}
            {showPagination && totalPages > 1 && (
                <div className="notice-skin-pagination">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        maxVisiblePages={maxVisiblePages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );

    // 상세 뷰 렌더링
    const renderDetailView = () => (
        <>
            {selectedNotice ? (
                <div className="notice-skin-detail">
                    <div className="notice-skin-detail-info">
                        <h3 className="notice-skin-detail-title" style={titleStyle}>
                            {selectedNotice.title}
                        </h3>
                        <div className="notice-skin-detail-meta">
                            <span className="notice-skin-detail-writer">{selectedNotice.writer}</span>
                            <span className="notice-skin-detail-date">{selectedNotice.createAt}</span>
                        </div>
                    </div>
                    
                    <div className="notice-skin-detail-body">
                        <p className="notice-skin-detail-text" style={contentStyle}>
                            {selectedNotice.content}
                        </p>
                    </div>

                    <div className="notice-skin-detail-actions">
                        {showBackButton && (
                            <ColorButton
                                colorType={buttonStyle === 'filled' ? 'black' : 'white'}
                                ariaLabel="목록으로"
                                onClick={handleGoBack}
                                tailwind="notice-skin-button"
                            >
                                목록으로
                            </ColorButton>
                        )}
                        
                        {showShareButton && (
                            <ColorButton
                                colorType="white"
                                ariaLabel="공유하기"
                                onClick={handleShare}
                                tailwind="notice-skin-button"
                            >
                                공유하기
                            </ColorButton>
                        )}
                        
                        {showPrintButton && (
                            <ColorButton
                                colorType="white"
                                ariaLabel="인쇄하기"
                                onClick={handlePrint}
                                tailwind="notice-skin-button"
                            >
                                인쇄하기
                            </ColorButton>
                        )}
                    </div>
                </div>
            ) : (
                <div className="notice-skin-empty">
                    <NoData
                        title="공지사항을 찾을 수 없습니다"
                        description="요청하신 공지사항이 존재하지 않거나 삭제되었습니다."
                    />
                </div>
            )}
        </>
    );

    return (
        <div 
            ref={containerRef}
            className="notice-skin-container" 
            style={containerStyle}
            data-view={view}
        >
            <section className="notice-skin-wrapper">
                <div className="notice-skin-header">
                    <h2 className="notice-skin-page-title">공지사항</h2>
                </div>

                <div className="notice-skin-content">
                    {view === 'list' ? renderListView() : renderDetailView()}
                </div>
            </section>
        </div>
    );
};

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(NoticeSkin as any).SAMPLE_DATA = NOTICE_MOCK_DATA;

// 웹빌더 통합을 위한 기본 export
export default NoticeSkin;