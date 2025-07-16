export interface ComponentSkinProps {
  data: ShopData;
  actions: ShopActions;
  options: ShopOptions;
  utils: {
    navigate: (path: string) => void;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
  };
  mode: 'edit' | 'view';
  app?: any;
  editor?: any;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  link?: string;
}

export interface ProductBadge {
  type: 'best' | 'new' | 'sale' | 'premium' | 'eco' | 'gift';
  label: string;
}

export interface ShopData {
  products: Product[];
  totalCount?: number;
  categoryName?: string;
  noDataTitle?: string;
  noDataDescription?: string;
}

export interface ShopActions {
  addToCart: (productId: number) => void;
  loadMore?: () => void;
  refresh?: () => void;
}

export interface ShopOptions {
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