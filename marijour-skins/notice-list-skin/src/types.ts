import { ComponentSkinProps } from '@wcbuilder/core';

export interface NoticeItem {
  id: number | string;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  isImportant?: boolean;
  category?: string;
  viewCount?: number;
}

export interface NoticeListData {
  // Notice items
  notices: NoticeItem[];
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  
  // Display options
  title?: string;
  showContent?: boolean;
  contentLineClamp?: number;
  showWriter?: boolean;
  showDate?: boolean;
  showViewCount?: boolean;
  showCategory?: boolean;
  
  // Search and filter
  searchKeyword?: string;
  selectedCategory?: string;
  categories?: Array<{
    value: string;
    label: string;
  }>;
  
  // Layout
  layout?: 'list' | 'card';
  
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: boolean;
  
  // Other options
  enableSearch?: boolean;
  enableCategoryFilter?: boolean;
  dateFormat?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export type NoticeListSkinProps = ComponentSkinProps<NoticeListData>;