import React from 'react';

// 스타일 import
import './my-order-list-skin-scoped.css';

// Mock 데이터
const MOCK_ORDERS = [
    {
        id: 'ORD123456789',
        date: '2025-05-05',
        items: [
            {
                id: 1,
                name: '레고트 누프레임 커플잔 2P',
                quantity: 2,
                price: 64000,
                image: '/images/product-1.jpg',
                status: '입금 대기',
                productUrl: '/products/1'
            },
            {
                id: 2,
                name: '모던 스톤웨어 접시 세트',
                quantity: 1,
                price: 25500,
                image: '/images/product-2.jpg',
                status: '입금 대기',
                productUrl: '/products/2'
            }
        ]
    },
    {
        id: 'ORD987654321',
        date: '2025-04-20',
        items: [
            {
                id: 3,
                name: '아로마 디퓨저 세트',
                quantity: 1,
                price: 45000,
                image: '/images/product-3.jpg',
                status: '배송 완료',
                productUrl: '/products/3'
            }
        ]
    }
];

// 좌측 메뉴 데이터
const MENU_ITEMS = [
    { name: '주문 배송 조회', href: '/my-page/orders', active: true },
    { name: '문의 내역', href: '/my-page/qna', active: false },
    { name: '회원정보 수정', href: '/my-page/info', active: false }
];

/**
 * MyOrderListSkin 컴포넌트 - 주문 배송 조회 페이지 UMD 버전
 */
export function MyOrderList() {
    return (
        <div className="mol-skin-globalWrapper">
            {/* 좌측 메뉴 영역 */}
            <section className="mol-skin-sidebar">
                <div className="mol-skin-sidebar-header">
                    <h2>마이페이지</h2>
                </div>
                <nav className="mol-skin-nav">
                    <ul className="mol-skin-nav-list">
                        {MENU_ITEMS.map((item) => (
                            <li key={item.href} className={`mol-skin-nav-item ${item.active ? 'mol-skin-nav-item-active' : ''}`}>
                                <a className="mol-skin-nav-link" href={item.href}>
                                    <span>{item.name}</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mol-skin-nav-arrow">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

            {/* 우측 콘텐츠 영역 */}
            <section className="mol-skin-content">
                <div className="mol-skin-content-header">
                    <h3 className="mol-skin-content-title">
                        <span>주문 배송 조회</span>
                    </h3>
                </div>

                {/* 주문 목록 */}
                <ul className="mol-skin-order-list">
                    {MOCK_ORDERS.map((order) => (
                        <li key={order.id} className="mol-skin-order-item">
                            <div className="mol-skin-order-header">
                                <p className="mol-skin-order-date">{order.date}</p>
                                <span className="mol-skin-divider"></span>
                                <a className="mol-skin-order-link" href={`/my-page/orders/detail/${order.id}`}>
                                    <span>주문 번호 : {order.id}</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mol-skin-order-arrow">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
                                    </svg>
                                </a>
                            </div>

                            {/* 상품 목록 */}
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.id} className="mol-skin-product-item">
                                        <div className="mol-skin-product-info">
                                            <div className="mol-skin-product-image">
                                                <a href={item.productUrl}>
                                                    <img src={item.image} alt={item.name} />
                                                </a>
                                            </div>
                                            <div className="mol-skin-product-details">
                                                <p className="mol-skin-product-name">{item.name}</p>
                                                <div className="mol-skin-product-meta">
                                                    <p>{item.quantity}개</p>
                                                    <span className="mol-skin-divider"></span>
                                                    <p>{item.price.toLocaleString()}원</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mol-skin-product-actions">
                                            <p className="mol-skin-product-status">{item.status}</p>
                                            <button type="button" className="mol-skin-cancel-button">주문 취소</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default MyOrderList;