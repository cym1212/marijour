export interface Review {
  id: number | string;
  productId?: number | string;
  productName?: string;
  productImage?: string;
  rating: number;
  content: string;
  images?: string[];
  writer: string;
  createdAt: string;
  isBest?: boolean;
  helpfulCount?: number;
}

export interface ReviewStatistics {
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFilter {
  sortBy?: 'latest' | 'rating_high' | 'rating_low' | 'helpful';
  rating?: number;
  hasImage?: boolean;
  isBest?: boolean;
}

export interface ReviewFormData {
  rating: number;
  content: string;
  images?: File[];
}

export interface ReviewSectionData {
  reviews: Review[];
  statistics?: ReviewStatistics;
  currentFilter?: ReviewFilter;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  showStatistics?: boolean;
  showFilter?: boolean;
  showWriteForm?: boolean;
  allowImageUpload?: boolean;
  maxImageCount?: number;
  minContentLength?: number;
  maxContentLength?: number;
}

export interface ReviewSectionActions {
  onFilterChange?: (filter: ReviewFilter) => void;
  onPageChange?: (page: number) => void;
  onReviewSubmit?: (data: ReviewFormData) => Promise<void>;
  onReviewDelete?: (reviewId: number | string) => void;
  onReviewReport?: (reviewId: number | string) => void;
  onImageClick?: (images: string[], index: number) => void;
  onHelpfulClick?: (reviewId: number | string) => void;
}

export interface ReviewSectionOptions {
  dateFormat?: string;
  showProductInfo?: boolean;
  showBestBadge?: boolean;
  showHelpfulButton?: boolean;
  allowAnonymous?: boolean;
  maskedWriterName?: boolean;
  emptyMessage?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  writeButtonText?: string;
  filterLabels?: {
    latest?: string;
    rating_high?: string;
    rating_low?: string;
    helpful?: string;
  };
}

export interface ComponentSkinProps<T = any> {
  data: T;
  actions?: any;
  options?: any;
  utils?: {
    navigate?: (path: string) => void;
    [key: string]: any;
  };
  mode?: 'view' | 'edit';
  app?: any;
  editor?: any;
}

export interface ReviewSectionSkinProps extends ComponentSkinProps<ReviewSectionData> {
  actions?: ReviewSectionActions;
  options?: ReviewSectionOptions;
}