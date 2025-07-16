export interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void;
}

export interface RefundAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { depositor: string; bank: string; accountNumber: string }) => void;
}
