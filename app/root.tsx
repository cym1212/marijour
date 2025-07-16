/**
 * Root 컴포넌트 - 애플리케이션의 루트 레이아웃
 * 전역 레이아웃 구조 및 메타데이터 관리
 */
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { GlobalTopBanner } from '@/components/ui/banner/GlobalTopBanner';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';

import type { Route } from './+types/root';

import './app.css';
import { useEffect } from 'react';

gsap.registerPlugin(useGSAP);

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const handleResize = () => {
        const bannerTextBox = document.querySelector('#globalTopBanner');
        const header = document.querySelector('#header');
        const footer = document.querySelector('#footer');
        const main = document.querySelector('#main');

        const bannerHeight = bannerTextBox?.clientHeight || 0;
        const headerHeight = header?.clientHeight || 0;
        const footerHeight = footer?.clientHeight || 0;
        const totalHeight = bannerHeight + headerHeight + footerHeight;

        gsap.set(main, { minHeight: `calc(100vh - ${totalHeight}px)` });
    };

    useEffect(() => {
        handleResize();

        // 리사이즈 이벤트 최적화 (디바운싱)
        let resizeTimeout: NodeJS.Timeout;
        const handleResizeTimeout = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleResize();
            }, 10);
        };

        window.addEventListener('resize', handleResizeTimeout, { passive: true });

        // cleanup 함수
        return () => {
            window.removeEventListener('resize', handleResizeTimeout);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <div>
            <GlobalTopBanner text="Happy Family Month 🤍 16% Sale" />
            <Header />
            <main id="main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let title = '오류';
    let message = '예상치 못한 오류가 발생했습니다.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        title = error.status === 404 ? '404: 페이지를 찾을 수 없습니다' : `오류 ${error.status}`;
        message = error.status === 404 ? '요청하신 페이지를 찾을 수 없습니다.' : error.statusText || message;
    } else if (import.meta.env.DEV && error instanceof Error) {
        // 개발 환경에서만 오류 스택을 노출합니다.
        message = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="mb-4">{message}</p>
            {stack && (
                <pre className="w-full p-4 bg-gray-100 text-left overflow-x-auto rounded">
                    <code>{stack}</code>
                </pre>
            )}
            {error instanceof Error || isRouteErrorResponse(error) ? (
                <p>
                    <a
                        href="/"
                        className="text-blue-600 hover:underline"
                    >
                        홈으로 돌아가기
                    </a>
                </p>
            ) : null}
        </main>
    );
}
