# E-commerce Project - Marijour

크몽 K4723387477님 외뢰 작업

## 🛠 기술 스택

-   **Frontend**: React 19, TypeScript
-   **Routing**: React Router 7
-   **Styling**: Tailwind CSS 4
-   **Animation**: GSAP 3
-   **Build Tool**: Vite

## 📁 프로젝트 구조

```
app/
├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── ui/            # UI 컴포넌트 (버튼, 입력, 모달 등)
│   ├── header/        # 헤더 관련 컴포넌트
│   ├── footer/        # 푸터 컴포넌트
│   ├── icons/         # SVG 아이콘 컴포넌트
│   └── terms/         # 약관 관련 컴포넌트
├── routes/            # 페이지 라우트
│   ├── _index.tsx     # 메인 페이지
│   ├── shop.$/        # 상품 목록 페이지
│   ├── products.$id/  # 상품 상세 페이지
│   ├── _order.cart/   # 장바구니 페이지
│   ├── _order.order.*/# 주문 관련 페이지
│   ├── _auth.*/       # 인증 관련 페이지
│   └── _my-page.*/    # 마이페이지
├── constants/         # 상수 데이터
├── types/            # TypeScript 타입 정의
└── utils/            # 유틸리티 함수
```

## 🎨 UI/UX 특징

-   **반응형 디자인**: 모바일/데스크톱 최적화
-   **애니메이션**: GSAP 기반 스크롤 트리거 및 페이드 효과
-   **접근성**: 시맨틱 HTML 마크업 및 Aria 태크, 키보드 네비게이션 지원

## 📝 코딩 컨벤션

```
tailwind css & route path = 케밥케이스
그 외 네이밍 = 카멜케이스
```

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 타입 체크
npm run typecheck

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📦 주요 패키지

-   `react-router`: 7.5.3 - 최신 React Router 버전
-   `gsap`: 3.13.0 - 고성능 애니메이션 라이브러리
-   `react-daum-postcode`: 3.2.0 - 주소 검색 API
-   `swiper`: 11.2.10 - 터치 슬라이더

## 🔧 개발 참고사항

-   **유효성 검사**: 현재 폼 검증은 임시 구현으로, 실제 요구사항에 맞게 수정 필요
-   **Mock 데이터**: constants 폴더의 Mock 데이터를 실제 API로 교체 필요
-   **SEO**: 모든 페이지에 meta 함수로 SEO 설정 가능
-   **타입 안정성**: 모든 컴포넌트에 TypeScript 타입 정의 적용

## 📞 문의

해당 프로젝트와 관련된 문의사항은 아래로 연락 부탁드립니다.

-   **이메일**: chlqhdtn98@gmail.com
-   **크몽 메시지**: 프로젝트 메시지를 통해 문의
