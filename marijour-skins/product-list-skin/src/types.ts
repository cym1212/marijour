// ProductList 스킨 타입 정의
export interface ComponentSkinProps {
  data: ProductListData;
  actions: ProductListActions;
  options: ProductListOptions;
  utils: {
    t: (key: string) => string; // 번역
    navigate: (path: string) => void; // 페이지 이동
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: any[]) => string; // 클래스명 조합
  };
  mode: 'editor' | 'preview' | 'production';
  app?: {
    user?: any;
    company?: any;
    currentLanguage?: string;
    theme?: any;
  };
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
  };
}

// 상품 객체 구조
export interface Product {
  id: number | string;           // 상품 ID
  title: string;                 // 상품 제목
  name: string;                  // 상품 이름
  description?: string;          // 상품 설명
  image?: string;                // 메인 이미지 URL
  thumbnail?: string;            // 썸네일 이미지 URL
  imageTwo?: string;             // 보조 이미지 URL (호버용)
  price: number;                 // 할인가 (현재 가격)
  originalPrice?: number;        // 원가 (할인 전 가격)
  discountPercent?: number;      // 할인율
  sale?: string;                 // 세일 라벨 (NEW, SALE 등)
  stockCount?: number;           // 재고 수량
  isInStock?: boolean;           // 재고 여부
  rating?: number;               // 평점 (1-5)
  reviewCount?: number;          // 리뷰 수
  badges?: string[];             // 배지 배열
  category_id?: string;          // 카테고리 ID
  created_at?: string;           // 생성일
}

// ProductList 데이터
export interface ProductListData {
  // 상품 관련 데이터
  products: Product[];
  loading: boolean;
  totalProducts: number;
  selectedCategory: string | null;
  searchQuery: string;
  
  // 페이지네이션 데이터
  currentPage: number;
  totalPages: number;
  
  // 모바일 무한 스크롤 데이터
  mobileProducts?: Product[];    // 모바일 누적 상품 목록
  mobilePage?: number;           // 모바일 현재 페이지
  isLoadingMore?: boolean;       // 더보기 로딩 상태
  hasMore?: boolean;             // 더 로드할 상품이 있는지
  
  // 정렬 및 설정 데이터
  sortBy: string;
  sortOrder: string;
  itemsPerRow: number;
  showStock: boolean;
  
  // 사용자 및 시스템 데이터
  isUserLoggedIn: boolean;
  isAdminMode: boolean;
  theme: {
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
  };
}

// ProductList 액션
export interface ProductListActions {
  handleAddToCart: (product: Product) => void;
  handleCategoryChange: (categoryId: string | null) => void;
  handleSearch: (query: string) => void;
  handleSortChange: (sortBy: string, sortOrder: string) => void;
  handlePageChange: (page: number) => void;
  handleLoadMore?: () => void;  // 모바일 무한 스크롤용
}

// ProductList 옵션 (속성 패널에서 설정 가능한 모든 옵션)
export interface ProductListOptions {
  // 레이아웃 설정
  order?: number;                    // 컴포넌트 순서
  lg?: number;                       // 그리드 크기 (1-12, 기본값: 12)
  className?: string;                // CSS 클래스명 (기본값: 'padding-tb-40')
  itemsPerPage?: number;             // 페이지당 상품 수 (기본값: 20)
  
  // 상품 필터링
  categoryId?: string;               // 특정 카테고리 ID
  include_product_ids?: string;      // 포함할 상품 ID (콤마 구분)
  exclude_product_ids?: string;      // 제외할 상품 ID (콤마 구분)
  include_category_ids?: string;     // 포함할 카테고리 ID (콤마 구분)
  exclude_category_ids?: string;     // 제외할 카테고리 ID (콤마 구분)
  excludeIndexes?: string;           // 제외할 인덱스 (콤마 구분)
  
  // 표시 설정
  showPrice?: boolean;               // 가격 표시 여부 (기본값: true)
  showAddToCart?: boolean;           // 장바구니 버튼 표시 (기본값: true)
  showPagination?: boolean;          // 페이지네이션 표시 (기본값: true)
  enableInfiniteScroll?: boolean;    // 모바일 무한 스크롤 활성화 (기본값: true)
  
  // 스타일 설정
  backgroundColor?: string;          // 컨테이너 배경색 (기본값: '#ffffff')
  padding?: string;                  // 컨테이너 여백 (기본값: '20px')
  borderRadius?: string;             // 테두리 둥글기 (기본값: '8px')
  priceColor?: string;               // 가격 텍스트 색상 (기본값: '#ff6b6b')
  cartButtonColor?: string;          // 장바구니 버튼 색상 (기본값: '#007bff')
  stockTextColor?: string;           // 재고 텍스트 색상 (기본값: '#28a745')
  
  // 기존 호환성 옵션
  title?: string;
  buttonColor?: string;
  theme?: {
    colorset?: {
      primaryColor?: string;
      secondaryColor?: string;
      tertiaryColor?: string;
    };
  };
  enableInfiniteScroll?: boolean;
  productsPerPage?: number;
}