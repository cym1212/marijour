/**
 * Footer 컴포넌트 - 사이트 하단 정보
 * 회사 정보, 이용약관, 개인정보처리방침 등을 표시
 */
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const COMPANY_INFO_DATA = [
    [
        { title: '상호', content: 'Marijour', type: 'text' },
        { title: '대표', content: '홍길동', type: 'text' },
        { title: '개인정보관리책임자', content: '홍길동', type: 'text' },
    ],
    [
        { title: '전화', content: '1234-5678', type: 'tel' },
        { title: '이메일', content: 'example@example.com', type: 'email' },
        { title: '주소', content: '서울특별시 강남구 테헤란로 123', type: 'text' },
    ],
    [
        { title: '사업자등록번호', content: '211-88-81810', type: 'href' },
        { title: '통신판매업신고번호', content: '2025-서울강남-12345', type: 'text' },
        { title: '호스팅 제공자', content: '아무개', type: 'text' },
    ],
];
export function Footer() {
    useGSAP(() => {
        gsap.to('#footer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <footer
            id="footer"
            className="opacity-0"
        >
            <div className="globalWrapper border-t border-black/10 py-8 md:py-10">
                <h2 className="text-3xl font-serif leading-logo">Marijour</h2>
                <nav className="mt-9">
                    <ul className="flex flex-wrap gap-6 leading-body">
                        <li>
                            <Link
                                to="/policy"
                                className="text-xs md:text-sm text-black hover-primary"
                            >
                                이용약관
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy"
                                className="text-xs md:text-sm text-black hover-primary"
                            >
                                개인정보처리방침
                            </Link>
                        </li>
                        <li>
                            {/* a태그 href url뒤에 사업자번호 바꾸시면 됩니다. */}
                            <a
                                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=2118881810"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs md:text-sm text-black hover-primary"
                            >
                                사업자정보확인
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/qna"
                                className="text-xs md:text-sm text-black hover-primary"
                            >
                                1:1 문의
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="companyInfo text-black/80 leading-body text-xs space-y-1 mt-6">
                    {COMPANY_INFO_DATA.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex flex-wrap items-center"
                        >
                            {row.map((item, itemIndex) => (
                                <dl
                                    key={item.title}
                                    className="flex items-center whitespace-nowrap"
                                >
                                    <dt className="inline">{item.title} :</dt>
                                    <dd className="inline ml-1">
                                        {item.type === 'email' ? (
                                            <a
                                                href={`mailto:${item.content}`}
                                                className="hover-primary"
                                            >
                                                {item.content}
                                            </a>
                                        ) : item.type === 'tel' ? (
                                            <a
                                                href={`tel:${item.content}`}
                                                className="hover-primary"
                                            >
                                                {item.content}
                                            </a>
                                        ) : item.type === 'href' ? (
                                            <a
                                                href={`https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${item.content.replace(/-/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover-primary"
                                            >
                                                {item.content}
                                            </a>
                                        ) : (
                                            item.content
                                        )}
                                    </dd>
                                    {itemIndex < row.length - 1 && <span className="text-black/20 px-1.5">|</span>}
                                </dl>
                            ))}
                        </div>
                    ))}
                </div>
                <p className="text-black/40 text-xs leading-body mt-6">©Marijour. 2025 ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
}
