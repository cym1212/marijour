import type { LabelInputProps } from '@/types/ui';

export function LabelInput({ label, validateContent, htmlFor, children, required = true }: LabelInputProps) {
    return (
        <div className="flex flex-col">
            <label
                htmlFor={htmlFor}
                className={`mb-2 text-sm ${required ? "after:content-['*'] after:text-primary after:ml-1" : ''}`}
            >
                {label}
            </label>
            {children}
            {validateContent && <div className="mt-2">{validateContent}</div>}
        </div>
    );
}
