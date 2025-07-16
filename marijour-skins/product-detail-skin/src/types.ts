// 문서 가이드라인에 맞는 타입 정의
export interface ProductDetailSkinProps {
  data: {
    product?: {
      id?: number;
      name?: string;
      price?: number;
      originalPrice?: number;
      discountRate?: number;
      images?: Array<{
        url: string;
        alt?: string;
      }>;
      rating?: number;
      reviewCount?: number;
      stock?: number;
      specifications?: Record<string, string>;
      description?: string;
      detailImageUrl?: string;
      options?: Array<{
        name: string;
        values: string[];
        required?: boolean;
      }>;
    };
    selectedOptions?: Record<string, string>;
    quantity?: number;
    loading?: boolean;
    activeTab?: string;
    mainImage?: string;
    relatedProducts?: Array<{
      id: number;
      name: string;
      price: number;
      image: string;
    }>;
    reviews?: Array<{
      id: number;
      rating: number;
      author: string;
      date: string;
      content: string;
      images?: string[];
    }>;
    isUserLoggedIn?: boolean;
    isAdminMode?: boolean;
    theme?: {
      colorset?: {
        primaryColor?: string;
        secondaryColor?: string;
        tertiaryColor?: string;
      };
    };
  };
  actions?: {
    handleOptionChange?: (optionName: string, value: string) => void;
    handleQuantityChange?: (quantity: number) => void;
    handleAddToCart?: () => void;
    handleBuyNow?: () => void;
    handleTabChange?: (tabName: string) => void;
    handleImageChange?: (imageUrl: string) => void;
  };
  options?: {
    showDescriptionTab?: boolean;
    showReviewsTab?: boolean;
    showSpecificationTab?: boolean;
    showStock?: boolean;
    showRelatedProducts?: boolean;
    showQuantitySelector?: boolean;
    showAddToCart?: boolean;
    showBuyNow?: boolean;
    addToCartButtonColor?: string;
    buyNowButtonColor?: string;
    priceColor?: string;
    stockTextColor?: string;
    order?: string;
    none?: string;
    lg?: string;
  };
  mode?: string;
  utils?: {
    t?: (key: string) => string;
    cx?: (...classes: string[]) => string;
    navigate?: (path: string) => void;
    formatCurrency?: (amount: number) => string;
    formatDate?: (date: Date) => string;
    getAssetUrl?: (path: string) => string;
  };
  app?: any;
  editor?: any;
}