# Notice Skin 개발 가이드

Notice Skin은 공지사항 리스트와 상세 페이지를 통합한 독립적인 UI 컴포넌트입니다. UMD 번들로 제공되어 다양한 환경에서 사용할 수 있습니다.

## 목차
- [개요](#개요)
- [빌드 방법](#빌드-방법)
- [사용 방법](#사용-방법)
- [Props 인터페이스](#props-인터페이스)
- [스타일 커스터마이징](#스타일-커스터마이징)
- [예제 코드](#예제-코드)

## 개요

Notice Skin은 다음과 같은 기능을 제공합니다:
- 공지사항 리스트 표시
- 공지사항 상세 내용 표시
- 페이지네이션 지원
- 애니메이션 효과 (GSAP)
- 반응형 디자인
- 테마 지원 (라이트/다크)
- 인쇄 스타일 지원

## 빌드 방법

### 1. 개별 빌드
```bash
npm run build:skin:notice
```

### 2. 전체 스킨 빌드
```bash
npm run build:skin:all
```

### 3. 빌드 결과물
- `dist/notice/notice-skin.umd.js` - JavaScript 번들
- `dist/notice/notice-skin.css` - CSS 스타일

## 사용 방법

### 1. 필수 의존성
```html
<!-- React & ReactDOM -->
<script crossorigin src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>

<!-- GSAP (애니메이션 사용 시) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

### 2. Notice Skin 로드
```html
<!-- CSS -->
<link rel="stylesheet" href="./dist/notice/notice-skin.css">

<!-- JavaScript -->
<script src="./dist/notice/notice-skin.umd.js"></script>
```

### 3. 기본 사용
```javascript
const props = {
    data: {
        notices: noticeArray,      // 공지사항 배열
        view: 'list',             // 'list' 또는 'detail'
        currentPage: 1,
        totalPages: 3,
        itemsPerPage: 10
    }
};

const element = React.createElement(NoticeSkin, props);
ReactDOM.render(element, document.getElementById('notice-root'));
```

## Props 인터페이스

### data 객체
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| notices | Notice[] | [] | 공지사항 데이터 배열 |
| selectedNotice | Notice \| null | null | 선택된 공지사항 (상세 뷰) |
| currentPage | number | 1 | 현재 페이지 번호 |
| totalPages | number | 1 | 전체 페이지 수 |
| itemsPerPage | number | 10 | 페이지당 항목 수 |
| loading | boolean | false | 로딩 상태 |
| view | 'list' \| 'detail' | 'list' | 현재 뷰 모드 |
| theme | object | {} | 테마 설정 객체 |

### Notice 인터페이스
```typescript
interface Notice {
    id: number;
    title: string;
    content: string;
    writer: string;
    createAt: string;
}
```

### actions 객체
| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| handleNoticeClick | (notice: Notice) => void | 공지사항 클릭 시 |
| handlePageChange | (page: number) => void | 페이지 변경 시 |
| handleGoBack | () => void | 목록으로 돌아가기 |
| handleShare | () => void | 공유하기 |
| handlePrint | () => void | 인쇄하기 |

### options 객체
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| **리스트 옵션** |
| showPagination | boolean | true | 페이지네이션 표시 여부 |
| maxVisiblePages | number | 5 | 최대 표시 페이지 수 |
| showWriter | boolean | true | 작성자 표시 여부 |
| showDate | boolean | true | 날짜 표시 여부 |
| showContent | boolean | true | 내용 미리보기 표시 여부 |
| contentLineClamp | number | 2 | 내용 미리보기 줄 수 |
| **상세 옵션** |
| showBackButton | boolean | true | 목록 버튼 표시 여부 |
| showShareButton | boolean | false | 공유 버튼 표시 여부 |
| showPrintButton | boolean | false | 인쇄 버튼 표시 여부 |
| **공통 옵션** |
| titleFontSize | string | 리스트: '0.875rem', 상세: '1.125rem' | 제목 글꼴 크기 |
| titleFontWeight | string | '700' | 제목 글꼴 두께 |
| contentFontSize | string | '1rem' | 내용 글꼴 크기 |
| lineHeight | string | '1.625' | 줄 높이 |
| buttonStyle | 'filled' \| 'outline' \| 'text' | 'outline' | 버튼 스타일 |
| animation | boolean | true | 애니메이션 사용 여부 |
| animationDuration | number | 0.9 | 애니메이션 지속 시간 (초) |

## 스타일 커스터마이징

### 1. CSS 클래스 구조
```css
/* 컨테이너 */
.notice-skin-container
.notice-skin-wrapper
.notice-skin-header
.notice-skin-content

/* 리스트 뷰 */
.notice-skin-list
.notice-skin-item
.notice-skin-item-button
.notice-skin-item-content
.notice-skin-item-title
.notice-skin-item-text
.notice-skin-item-meta
.notice-skin-pagination

/* 상세 뷰 */
.notice-skin-detail
.notice-skin-detail-info
.notice-skin-detail-title
.notice-skin-detail-meta
.notice-skin-detail-body
.notice-skin-detail-text
.notice-skin-detail-actions

/* 특수 상태 */
.notice-skin-loading
.notice-skin-empty
```

### 2. 테마 적용
```javascript
// 다크 테마 예제
const props = {
    data: {
        theme: {
            backgroundColor: '#1a1a1a',
            textColor: '#ffffff',
            primary: '#007bff',
            secondary: '#6c757d'
        }
    }
};
```

### 3. CSS 오버라이드
```css
/* 커스텀 스타일 예제 */
.notice-skin-container {
    font-family: 'Noto Sans KR', sans-serif;
}

.notice-skin-item-title {
    color: #2c3e50;
    font-weight: 600;
}

/* 다크 테마 커스터마이징 */
[data-theme="dark"] .notice-skin-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
}
```

## 내장 샘플 데이터

NoticeSkin 번들에는 20개의 샘플 공지사항 데이터가 내장되어 있습니다:

### 자동 사용
```javascript
// 데이터를 전달하지 않으면 자동으로 샘플 데이터 사용
const element = React.createElement(NoticeSkin, {});
ReactDOM.render(element, document.getElementById('notice-root'));
```

### 수동 접근
```javascript
// 샘플 데이터에 직접 접근
const sampleData = NoticeSkin.SAMPLE_DATA;
console.log(sampleData.length); // 20
```

## 예제 코드

### 1. 기본 사용 (샘플 데이터 자동 사용)
```javascript
const NoticeBasicExample = () => {
    // 데이터를 전달하지 않으면 자동으로 샘플 데이터 사용
    const element = React.createElement(NoticeSkin, {});
    return element;
};
```

### 2. 외부 데이터 사용
```javascript
const NoticeListExample = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [noticeData, setNoticeData] = React.useState([]);
    
    // API에서 데이터 로드
    React.useEffect(() => {
        fetch('/api/notices')
            .then(res => res.json())
            .then(data => setNoticeData(data));
    }, []);
    
    const props = {
        data: {
            notices: noticeData, // 외부 데이터 사용
            currentPage: currentPage,
            totalPages: Math.ceil(noticeData.length / 10),
            view: 'list'
        },
        actions: {
            handlePageChange: (page) => setCurrentPage(page),
            handleNoticeClick: (notice) => {
                // 상세 페이지로 이동
                window.location.href = `/notice/${notice.id}`;
            }
        },
        options: {
            showPagination: true,
            contentLineClamp: 2
        }
    };
    
    return React.createElement(NoticeSkin, props);
};
```

### 3. 리스트/상세 통합 구현
```javascript
const NoticeApp = () => {
    const [state, setState] = React.useState({
        view: 'list',
        currentPage: 1,
        selectedNotice: null
    });
    
    const props = {
        data: {
            // notices를 비워두면 자동으로 샘플 데이터 사용
            selectedNotice: state.selectedNotice,
            currentPage: state.currentPage,
            view: state.view
        },
        actions: {
            handleNoticeClick: (notice) => {
                setState({
                    ...state,
                    selectedNotice: notice,
                    view: 'detail'
                });
            },
            handleGoBack: () => {
                setState({
                    ...state,
                    view: 'list',
                    selectedNotice: null
                });
            },
            handlePageChange: (page) => {
                setState({
                    ...state,
                    currentPage: page
                });
            }
        },
        options: {
            animation: true,
            showBackButton: true,
            showShareButton: true
        }
    };
    
    return React.createElement(NoticeSkin, props);
};
```

### 4. 웹빌더 통합 예제
```javascript
// 웹빌더에서 사용하는 경우
window.initNoticeSkin = function(config) {
    const {
        rootId = 'notice-root',
        apiUrl = '/api/notices',
        theme = 'light',
        itemsPerPage = 10
    } = config;
    
    // API 호출하여 데이터 로드
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const props = {
                data: {
                    notices: data.notices,
                    currentPage: 1,
                    totalPages: Math.ceil(data.total / itemsPerPage),
                    view: 'list',
                    theme: theme === 'dark' ? {
                        backgroundColor: '#1a1a1a',
                        textColor: '#ffffff'
                    } : {}
                },
                // ... actions와 options 설정
            };
            
            const element = React.createElement(NoticeSkin, props);
            ReactDOM.render(element, document.getElementById(rootId));
        });
};
```

## 문제 해결

### 애니메이션이 작동하지 않는 경우
- GSAP 라이브러리가 제대로 로드되었는지 확인
- `animation: true` 옵션이 설정되었는지 확인

### 스타일이 적용되지 않는 경우
- CSS 파일이 올바르게 로드되었는지 확인
- CSS 클래스 이름 충돌이 없는지 확인

### 페이지네이션이 보이지 않는 경우
- `totalPages`가 1보다 큰지 확인
- `showPagination: true` 옵션이 설정되었는지 확인

## 추가 정보

- 소스 코드: `/app/components/ui/notice/NoticeSkin.tsx`
- 스타일시트: `/app/components/ui/notice/notice-skin-scoped.css`
- 테스트 페이지: `/test-notice-skin.html`

## 스킨 컴포넌트 개발 가이드 (개발 과정 및 주의사항)

이 섹션은 Notice Skin 개발 과정에서 겪은 시행착오와 해결 방법을 정리한 것입니다. 다른 컴포넌트를 스킨화할 때 참고하세요.

### 1. 개발 프로세스

#### 1.1 요구사항 분석
- **초기 요구사항**: Notice 상세 페이지만 분리하여 UMD 번들로 만들기
- **변경된 요구사항**: Notice 리스트와 상세 페이지를 하나의 컴포넌트로 통합
- **교훈**: 요구사항을 명확히 파악하고, 통합 가능한 기능은 하나의 컴포넌트로 만드는 것이 효율적

#### 1.2 컴포넌트 구조 설계
```
NoticeSkin/
├── NoticeSkin.tsx          # 통합 컴포넌트 (리스트 + 상세)
├── notice-skin-scoped.css  # 독립적인 스타일
└── (빌드 결과물)
    ├── notice-skin.umd.js
    └── notice-skin.css
```

### 2. 주요 구현 포인트

#### 2.1 React Router 의존성 제거
**문제**: 원본 컴포넌트는 React Router를 사용
**해결**: 
- `Link` 컴포넌트 → `button` 요소로 변경
- `navigate()` → `handleGoBack` 콜백 함수로 대체
- 라우팅 로직을 외부에서 주입받도록 설계

```javascript
// 원본
<Link to={`/notice/${notice.id}`}>...</Link>
navigate(-1);

// 스킨 컴포넌트
<button onClick={() => handleNoticeClick(notice)}>...</button>
handleGoBack();
```

#### 2.2 Tailwind CSS → 일반 CSS 변환
**문제**: Tailwind 클래스는 외부 환경에서 작동하지 않음
**해결**:
- 모든 Tailwind 클래스를 일반 CSS로 변환
- BEM 방식의 클래스 네이밍 사용 (`.notice-skin-*`)
- 반응형 디자인은 미디어 쿼리로 구현

```css
/* Tailwind */
className="flex items-center gap-3 md:gap-20"

/* 변환된 CSS */
.notice-skin-item-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
@media (min-width: 768px) {
    .notice-skin-item-meta {
        gap: 5rem;
    }
}
```

#### 2.3 GSAP 애니메이션 처리
**문제**: GSAP이 없는 환경에서도 작동해야 함
**해결**:
```javascript
// 안전한 GSAP 등록
if (typeof window !== 'undefined' && gsap) {
    gsap.registerPlugin(ScrollTrigger);
}
```

### 3. CSS 번들링 이슈

#### 3.1 CSS 파일이 생성되지 않는 문제
**원인**: CSS 파일을 import하지 않으면 webpack이 CSS를 추출하지 않음
**해결**:
```javascript
// NoticeSkin.tsx에 CSS import 추가
import './notice-skin-scoped.css';
```

#### 3.2 스타일 격리
**중요**: 스킨 컴포넌트의 스타일이 호스트 앱의 스타일과 충돌하지 않도록 주의
- 모든 클래스명에 고유한 prefix 사용 (`.notice-skin-*`)
- 전역 스타일 사용 금지
- CSS 특이도를 낮게 유지하여 오버라이드 가능하도록 설계

### 4. 샘플 데이터 내장

#### 4.1 초기 접근 방법
```javascript
// 외부에서 접근 가능하도록 export
export const NOTICE_MOCK_DATA = [...];
```

#### 4.2 개선된 방법
```javascript
// 내부에서만 사용하는 샘플 데이터
const NOTICE_MOCK_DATA = [...];

// 데이터가 없으면 자동으로 샘플 데이터 사용
const { notices = NOTICE_MOCK_DATA, ... } = data;

// 필요시 외부 접근을 위한 static 속성
(NoticeSkin as any).SAMPLE_DATA = NOTICE_MOCK_DATA;
```

**장점**:
- 데이터 없이도 즉시 사용 가능
- 개발/테스트 시 편리
- 데모 페이지 제작 용이

### 5. Props 설계 패턴

#### 5.1 3단계 Props 구조
```javascript
interface NoticeSkinProps {
    data?: {      // 데이터 관련
        notices, selectedNotice, currentPage, ...
    };
    actions?: {   // 이벤트 핸들러
        handleNoticeClick, handlePageChange, ...
    };
    options?: {   // UI 옵션
        showPagination, animation, ...
    };
}
```

**장점**:
- 관심사 분리가 명확
- 선택적 사용 가능
- 기본값 제공으로 최소 설정만으로 작동

### 6. Webpack 설정

#### 6.1 컴포넌트 등록
```javascript
// webpack.config.multi.cjs
const components = {
  'notice': {
    entry: './app/components/ui/notice/NoticeSkin.tsx',
    name: 'NoticeSkin',
    filename: 'notice-skin'
  }
};
```

#### 6.2 빌드 스크립트
```json
// package.json
"build:skin:notice": "COMPONENT=notice webpack --config webpack.config.multi.cjs"
```

### 7. 테스트 페이지 작성

#### 7.1 인터랙티브 테스트 컨트롤
테스트 페이지에는 다양한 옵션을 테스트할 수 있는 컨트롤 패널 포함:
- 뷰 모드 전환 (리스트 ↔ 상세)
- 테마 변경 (라이트 ↔ 다크)
- 옵션 토글 (애니메이션, 페이지네이션 등)

#### 7.2 샘플 데이터 사용
```javascript
// 내장된 샘플 데이터 자동 사용
const element = React.createElement(NoticeSkin, {});
```

### 8. 개발 시 주의사항 체크리스트

- [ ] **의존성 제거**: React Router, 프로젝트 특화 컴포넌트 등
- [ ] **CSS 변환**: Tailwind → 일반 CSS
- [ ] **클래스명 격리**: 고유한 prefix 사용
- [ ] **CSS import**: webpack이 CSS를 추출할 수 있도록 import 추가
- [ ] **샘플 데이터**: 즉시 사용 가능하도록 내장
- [ ] **Props 구조**: data, actions, options 3단계 구조
- [ ] **기본값 제공**: 모든 props에 적절한 기본값
- [ ] **테스트 페이지**: 다양한 시나리오 테스트 가능하도록 구성
- [ ] **문서화**: Props 인터페이스, 사용 예제 포함

### 9. 트러블슈팅 경험

#### 9.1 "등록된 공지사항이 없습니다" 텍스트 이슈
**상황**: 사용자가 해당 텍스트의 출처를 물음
**해결**: 원본 컴포넌트 확인 후 동일하게 구현했음을 설명

#### 9.2 CSS 파일 미생성
**원인**: CSS import 누락
**해결**: `import './notice-skin-scoped.css';` 추가

#### 9.3 Mock 데이터 번들 포함 요청
**요구사항 변경**: 외부 접근 → 내장 데이터로 변경
**해결**: 컴포넌트 내부에 샘플 데이터 포함, 자동 사용 로직 구현

### 10. 다른 컴포넌트 스킨화 시 권장 프로세스

1. **원본 분석**: 의존성, 라우팅, 스타일 시스템 파악
2. **인터페이스 설계**: Props 구조 (data, actions, options)
3. **컴포넌트 작성**: 의존성 제거, 콜백 기반 설계
4. **스타일 변환**: Tailwind → 일반 CSS (격리된 클래스명)
5. **샘플 데이터**: 즉시 사용 가능하도록 내장
6. **Webpack 설정**: 엔트리 추가, 빌드 스크립트 생성
7. **테스트 페이지**: 인터랙티브 컨트롤 포함
8. **문서화**: 사용법, Props, 예제 코드
9. **검증**: CSS 번들링, 샘플 데이터 작동, 다양한 옵션 테스트