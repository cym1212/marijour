import { ComponentSkinProps } from '@wcbuilder/core';

export interface NoticeDetailData {
  // Notice info
  id?: number | string;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  category?: string;
  isImportant?: boolean;
  viewCount?: number;
  
  // Navigation
  prevNotice?: {
    id: number | string;
    title: string;
  };
  nextNotice?: {
    id: number | string;
    title: string;
  };
  
  // Display options
  pageTitle?: string;
  showCategory?: boolean;
  showViewCount?: boolean;
  showNavigation?: boolean;
  dateFormat?: string;
  
  // Button options
  listButtonText?: string;
  listButtonLink?: string;
  
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: boolean;
  
  // Files/attachments
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
  }>;
}

export type NoticeDetailSkinProps = ComponentSkinProps<NoticeDetailData>;