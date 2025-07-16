import React, { useEffect, useRef } from 'react';
import { ExternalSkinProps } from '@/types/skin-props';

interface FooterProps {
  data: ExternalSkinProps['data'];
}

export function Footer({ data }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const { withcookieData } = data;
  
  // 회사 정보 추출
  const companyInfo = {
    name: withcookieData?.skin?.extra?.company_name || 'Marijour',
    address: withcookieData?.skin?.address || '서울특별시 강남구 테헤란로 123',
    phone: withcookieData?.skin?.phone || '1234-5678',
    email: withcookieData?.skin?.email || 'example@example.com',
    owner: withcookieData?.skin?.owner || '홍길동',
    businessNumber: withcookieData?.skin?.businessNumber || '211-88-81810',
    mailOrderCert: withcookieData?.skin?.mailOrderBusinessCertificate || '2025-서울강남-12345',
    privacyOfficer: withcookieData?.skin?.owner || '홍길동'
  };

  // SNS 링크
  const snsLinks = withcookieData?.skin?.extra?.sns_banner || [];

  // 로고 URL
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url;

  useEffect(() => {
    // Fade-in 애니메이션
    if (footerRef.current) {
      footerRef.current.style.opacity = '0';
      setTimeout(() => {
        if (footerRef.current) {
          footerRef.current.style.transition = 'opacity 0.9s ease-out';
          footerRef.current.style.opacity = '1';
        }
      }, 100);
    }
  }, []);

  // 회사 정보 데이터 구조화
  const companyInfoData = [
    [
      { title: '상호', content: companyInfo.name, type: 'text' },
      { title: '대표', content: companyInfo.owner, type: 'text' },
      { title: '개인정보관리책임자', content: companyInfo.privacyOfficer, type: 'text' },
    ],
    [
      { title: '전화', content: companyInfo.phone, type: 'tel' },
      { title: '이메일', content: companyInfo.email, type: 'email' },
      { title: '주소', content: companyInfo.address, type: 'text' },
    ],
    [
      { title: '사업자등록번호', content: companyInfo.businessNumber, type: 'business' },
      { title: '통신판매업신고번호', content: companyInfo.mailOrderCert, type: 'text' },
      { title: '호스팅 제공자', content: 'Withcookie', type: 'text' },
    ],
  ];

  return (
    <footer id="footer" ref={footerRef} className="marijour-footer">
      <div className="marijour-wrapper">
        <div className="footer-content">
          {/* 로고 및 회사명 */}
          <div className="footer-brand">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={companyInfo.name}
                className="footer-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <h2 className={`footer-title ${logoUrl ? 'hidden' : ''}`}>{companyInfo.name}</h2>
          </div>

          {/* 링크 섹션 */}
          <nav className="footer-nav">
            <ul className="footer-links">
              <li>
                <a href="/policy" className="footer-link">이용약관</a>
              </li>
              <li>
                <a href="/privacy" className="footer-link">개인정보처리방침</a>
              </li>
              <li>
                <a 
                  href={`https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${companyInfo.businessNumber.replace(/-/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  사업자정보확인
                </a>
              </li>
              <li>
                <a href="/qna" className="footer-link">1:1 문의</a>
              </li>
            </ul>
          </nav>

          {/* 회사 정보 */}
          <div className="company-info">
            {companyInfoData.map((row, rowIndex) => (
              <div key={rowIndex} className="info-row">
                {row.map((item, itemIndex) => (
                  <dl key={item.title} className="info-item">
                    <dt>{item.title}:</dt>
                    <dd>
                      {item.type === 'email' ? (
                        <a href={`mailto:${item.content}`} className="info-link">
                          {item.content}
                        </a>
                      ) : item.type === 'tel' ? (
                        <a href={`tel:${item.content}`} className="info-link">
                          {item.content}
                        </a>
                      ) : item.type === 'business' ? (
                        <a 
                          href={`https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${item.content.replace(/-/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="info-link"
                        >
                          {item.content}
                        </a>
                      ) : (
                        item.content
                      )}
                    </dd>
                    {itemIndex < row.length - 1 && <span className="info-divider">|</span>}
                  </dl>
                ))}
              </div>
            ))}
          </div>

          {/* SNS 링크 */}
          {snsLinks.length > 0 && (
            <div className="social-links">
              {snsLinks.map((sns: any, index: number) => (
                <a 
                  key={index}
                  href={sns.url}
                  className={`social-link ${sns.style}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={sns.text}
                >
                  {sns.text}
                </a>
              ))}
            </div>
          )}

          {/* 저작권 */}
          <p className="copyright">
            ©{companyInfo.name}. {new Date().getFullYear()} ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}