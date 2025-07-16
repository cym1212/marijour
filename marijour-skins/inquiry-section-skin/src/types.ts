export type InquiryCategory = 
  | 'product'
  | 'order_payment'
  | 'delivery'
  | 'cancel_exchange_return'
  | 'other';

export type InquiryStatus = 
  | 'pending'
  | 'in_progress'
  | 'answered'
  | 'closed';

export interface Inquiry {
  id: number | string;
  category: InquiryCategory;
  title: string;
  content: string;
  status: InquiryStatus;
  isPrivate: boolean;
  createdAt: string;
  updatedAt?: string;
  answer?: InquiryAnswer;
  attachments?: InquiryAttachment[];
  writer: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface InquiryAnswer {
  id: number | string;
  content: string;
  answeredAt: string;
  answeredBy: string;
}

export interface InquiryAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
}

export interface InquiryFormData {
  category: InquiryCategory;
  title: string;
  content: string;
  isPrivate: boolean;
  attachments?: File[];
  writer: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface InquiryFilter {
  startDate?: string;
  endDate?: string;
  category?: InquiryCategory[];
  status?: InquiryStatus[];
  searchKeyword?: string;
}

export interface InquirySectionData {
  inquiries: Inquiry[];
  currentFilter?: InquiryFilter;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  selectedInquiryId?: number | string;
  viewMode?: 'list' | 'detail' | 'write';
  showWriteForm?: boolean;
  isLoggedIn?: boolean;
  currentUser?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface InquirySectionActions {
  onFilterChange?: (filter: InquiryFilter) => void;
  onPageChange?: (page: number) => void;
  onInquirySelect?: (inquiryId: number | string) => void;
  onViewModeChange?: (mode: 'list' | 'detail' | 'write') => void;
  onInquirySubmit?: (data: InquiryFormData) => Promise<void>;
  onInquiryEdit?: (inquiryId: number | string, data: Partial<InquiryFormData>) => void;
  onInquiryDelete?: (inquiryId: number | string) => void;
  onAttachmentDownload?: (attachment: InquiryAttachment) => void;
}

export interface InquirySectionOptions {
  dateFormat?: string;
  showFilter?: boolean;
  showPagination?: boolean;
  allowAttachments?: boolean;
  maxAttachmentCount?: number;
  maxAttachmentSize?: number; // in MB
  allowPrivateInquiry?: boolean;
  requireLogin?: boolean;
  emptyMessage?: string;
  categoryLabels?: {
    [key in InquiryCategory]?: string;
  };
  statusLabels?: {
    [key in InquiryStatus]?: string;
  };
  placeholders?: {
    [key in InquiryCategory]?: {
      title: string;
      content: string;
    };
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

export interface InquirySectionSkinProps extends ComponentSkinProps<InquirySectionData> {
  actions?: InquirySectionActions;
  options?: InquirySectionOptions;
}