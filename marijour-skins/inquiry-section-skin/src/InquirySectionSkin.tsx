import React, { useState, useEffect, useRef } from 'react';
import { InquirySectionSkinProps, Inquiry } from './types';
import { InquiryFilter } from './components/InquiryFilter';
import { InquiryList } from './components/InquiryList';
import { InquiryDetail } from './components/InquiryDetail';
import { InquiryForm } from './components/InquiryForm';
import { EmptyState } from './components/EmptyState';
import './inquiry-section-skin.scss';

const InquirySectionSkin: React.FC<InquirySectionSkinProps> = ({ 
  data, 
  actions, 
  options = {},
  utils 
}) => {
  const {
    inquiries = [],
    currentFilter = {},
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    selectedInquiryId,
    viewMode = 'list',
    showWriteForm = true,
    isLoggedIn = false,
    currentUser
  } = data || {};

  const {
    dateFormat = 'YYYY.MM.DD',
    showFilter = true,
    showPagination = true,
    allowAttachments = true,
    maxAttachmentCount = 5,
    maxAttachmentSize = 10, // MB
    allowPrivateInquiry = true,
    requireLogin = false,
    emptyMessage = '등록된 문의가 없습니다.',
    categoryLabels = {
      product: '상품 문의',
      order_payment: '주문/결제',
      delivery: '배송',
      cancel_exchange_return: '취소/교환/반품',
      other: '기타'
    },
    statusLabels = {
      pending: '답변 대기',
      in_progress: '답변 준비중',
      answered: '답변 완료',
      closed: '문의 종료'
    },
    placeholders = {
      product: {
        title: '상품명을 입력해주세요',
        content: '상품에 대한 문의사항을 자세히 적어주세요.\n(상품명, 옵션, 문의내용 등)'
      },
      order_payment: {
        title: '주문번호를 입력해주세요',
        content: '주문이나 결제 관련 문의사항을 적어주세요.\n(주문번호, 결제방법, 문제상황 등)'
      },
      delivery: {
        title: '배송 관련 문의',
        content: '배송 문의사항을 적어주세요.\n(주문번호, 배송지, 배송상태 등)'
      },
      cancel_exchange_return: {
        title: '취소/교환/반품 요청',
        content: '취소, 교환, 반품 사유를 자세히 적어주세요.\n(주문번호, 상품명, 사유 등)'
      },
      other: {
        title: '문의 제목을 입력해주세요',
        content: '문의내용을 자세히 적어주세요.'
      }
    }
  } = options;

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [currentMode, setCurrentMode] = useState(viewMode);
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  // 선택된 문의 업데이트
  useEffect(() => {
    if (selectedInquiryId) {
      const inquiry = inquiries.find(i => i.id === selectedInquiryId);
      setSelectedInquiry(inquiry || null);
      setCurrentMode('detail');
    }
  }, [selectedInquiryId, inquiries]);

  // viewMode 변경 감지
  useEffect(() => {
    setCurrentMode(viewMode);
  }, [viewMode]);

  const handleFilterChange = (filter: any) => {
    if (actions?.onFilterChange) {
      actions.onFilterChange(filter);
    }
  };

  const handlePageChange = (page: number) => {
    if (actions?.onPageChange) {
      actions.onPageChange(page);
    }
  };

  const handleInquirySelect = (inquiryId: number | string) => {
    const inquiry = inquiries.find(i => i.id === inquiryId);
    setSelectedInquiry(inquiry || null);
    setCurrentMode('detail');
    if (actions?.onInquirySelect) {
      actions.onInquirySelect(inquiryId);
    }
  };

  const handleWriteClick = () => {
    if (requireLogin && !isLoggedIn) {
      if (utils?.navigate) {
        utils.navigate('/login');
      } else {
        alert('로그인이 필요합니다.');
      }
      return;
    }
    setCurrentMode('write');
    if (actions?.onViewModeChange) {
      actions.onViewModeChange('write');
    }
  };

  const handleBackToList = () => {
    setSelectedInquiry(null);
    setCurrentMode('list');
    if (actions?.onViewModeChange) {
      actions.onViewModeChange('list');
    }
  };

  const handleInquirySubmit = async (formData: any) => {
    if (actions?.onInquirySubmit) {
      await actions.onInquirySubmit(formData);
      setCurrentMode('list');
    }
  };

  const handleInquiryAction = (action: string, inquiryId: number | string, data?: any) => {
    switch (action) {
      case 'edit':
        if (actions?.onInquiryEdit) {
          actions.onInquiryEdit(inquiryId, data);
        }
        break;
      case 'delete':
        if (actions?.onInquiryDelete) {
          actions.onInquiryDelete(inquiryId);
        }
        break;
    }
  };

  const handleAttachmentDownload = (attachment: any) => {
    if (actions?.onAttachmentDownload) {
      actions.onAttachmentDownload(attachment);
    } else {
      // 기본 다운로드 동작
      window.open(attachment.url, '_blank');
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          처음
        </button>
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {pages}
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
        <button
          className="page-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          마지막
        </button>
      </div>
    );
  };

  return (
    <div className="inquiry-section-skin" ref={containerRef}>
      <div className="inquiry-section-header">
        <h2 className="page-title">
          {currentMode === 'write' ? '문의하기' : 
           currentMode === 'detail' ? '문의 상세' : '문의 내역'}
        </h2>
        {currentMode === 'list' && showWriteForm && (
          <button className="write-button" onClick={handleWriteClick}>
            문의하기
          </button>
        )}
      </div>

      {showFilter && currentMode === 'list' && (
        <InquiryFilter
          filter={currentFilter}
          onChange={handleFilterChange}
          categoryLabels={categoryLabels}
          statusLabels={statusLabels}
        />
      )}

      {currentMode === 'write' ? (
        <InquiryForm
          onSubmit={handleInquirySubmit}
          onCancel={handleBackToList}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          allowAttachments={allowAttachments}
          maxAttachmentCount={maxAttachmentCount}
          maxAttachmentSize={maxAttachmentSize}
          allowPrivateInquiry={allowPrivateInquiry}
          categoryLabels={categoryLabels}
          placeholders={placeholders}
        />
      ) : currentMode === 'detail' && selectedInquiry ? (
        <InquiryDetail
          inquiry={selectedInquiry}
          categoryLabels={categoryLabels}
          statusLabels={statusLabels}
          dateFormat={dateFormat}
          isOwner={currentUser?.email === selectedInquiry.writer.email}
          onBack={handleBackToList}
          onAction={handleInquiryAction}
          onAttachmentDownload={handleAttachmentDownload}
        />
      ) : inquiries.length > 0 ? (
        <>
          <InquiryList
            inquiries={inquiries}
            categoryLabels={categoryLabels}
            statusLabels={statusLabels}
            dateFormat={dateFormat}
            onInquirySelect={handleInquirySelect}
          />
          {renderPagination()}
        </>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
};

export default InquirySectionSkin;