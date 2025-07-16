import { WarningIcon } from '@/components/icons/WarningIcon';

export function WarningLabel({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-1.5 text-error">
            <WarningIcon />
            <p className="text-sm">{message}</p>
        </div>
    );
}
