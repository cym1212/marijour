import { ValidateIcon } from '@/components/icons/ValidateIcon';

export function ValidateLabel({ isValid, message }: { isValid: boolean; message: string }) {
    return (
        <div className={`flex items-center gap-1.5 ${isValid ? 'text-success' : 'text-black/40'}`}>
            <ValidateIcon />
            <p className="text-sm">{message}</p>
        </div>
    );
}
