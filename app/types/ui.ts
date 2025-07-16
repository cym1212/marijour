import type { GNBData } from '@/types/navigation';
import type React from 'react';

export interface SearchBarProps {
    tailwind?: string;
    directionReverse?: boolean;
    hideCloseBtn?: boolean;
    isResetValue?: boolean;
    submitCallback?: () => void;
}

export interface BannerImageProps {
    src: {
        desktop: string;
        mobile: string;
    };
    isOverlay?: boolean;
}

export interface CenteredVisualBannerProps extends BannerImageProps {
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
    isSmallText?: boolean;
}

export interface SplitVisualBannerProps extends CenteredVisualBannerProps {
    imageDirection?: 'left' | 'right';
}

export interface KeyVisualSliderData {
    title: string;
    description: string;
    imageUrl: { desktop: string; mobile: string };
    buttonLink?: string;
}

export interface TextBannerProps extends BannerImageProps {
    title: string;
    description: string;
    buttonLink: string;
}

export interface SliderNavigationButtonProps {
    ref: React.Ref<HTMLDivElement>;
    direction: 'prev' | 'next';
    rotate: string;
    hoverColor: 'white' | 'black';
}

export interface SliderTitleProps {
    title: string;
    description: string;
}

export interface BreadcrumbTabsHeaderProps {
    navData: GNBData[];
    mainPath: string;
}

export interface ToastProps {
    isVisible: boolean;
    onAnimationComplete: () => void;
    message: string;
    duration?: number;
    actionButton?: {
        text: string;
        onClick?: () => void;
        href?: string;
    };
}

export interface ColorButtonProps {
    children: React.ReactNode;
    colorType: 'primary' | 'white' | 'grayLine';
    ariaLabel?: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (e: React.MouseEvent) => void;
    tailwind?: string;
    to?: string;
    disabled?: boolean;
}

export interface CartButtonProps {
    children: React.ReactNode;
    colorType: 'primary' | 'white';
    tailwind?: string;
    onAddProductCallBack?: () => void;
}

export interface ToastInstance {
    id: string;
    isVisible: boolean;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    maxVisiblePages?: number;
    baseUrl?: string;
    queryParamName?: string;
}

export interface NoDataProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    actionButton?: React.ReactNode;
    tailwind?: string;
}

export interface TextInputProps {
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    name?: string;
    required?: boolean;
    tailwind?: string;
    readOnly?: boolean;
    disabled?: boolean;
    onBlur?: () => void;
}

export interface TextAreaProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    id?: string;
    name?: string;
    required?: boolean;
    tailwind?: string;
    rows?: number;
    maxLength?: number;
    showCharCount?: boolean;
}

export interface LabelInputProps {
    label: string;
    validateContent?: React.ReactNode;
    htmlFor?: string;
    children: React.ReactNode;
    required?: boolean;
}

export interface CheckLabelBoxProps {
    id: string;
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
    modalContents?: React.ReactNode;
    required?: boolean;
}

export interface SelectBoxProps {
    name: string;
    value: string;
    placeholder: string;
    options: { value: string; label: string }[];
    required?: boolean;
    onChange: (value: string) => void;
    tailwind?: string;
    id?: string;
}

export interface AlertProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    onClose?: () => void;
}

export interface CouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyCoupon: (coupon: string) => void;
    availableCoupons?: Array<{
        id: string;
        name: string;
        discountAmount: number;
        discountType: 'amount' | 'percentage';
        expiryDate: string;
    }>;
}

export interface ConfirmProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}
