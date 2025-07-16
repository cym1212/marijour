import { useState } from 'react';

import type { TextAreaProps } from '@/types/ui';

export function TextArea({ id, placeholder, value, onChange, name, required, tailwind, rows = 5, maxLength = 2000, showCharCount = true }: TextAreaProps) {
    const [charCount, setCharCount] = useState(value.length);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        // 글자 수 제한 확인
        if (newValue.length <= maxLength) {
            setCharCount(newValue.length);
            onChange(e);
        }
    };

    return (
        <div className="relative w-full">
            <textarea
                id={id}
                aria-labelledby={name || 'textarea'}
                placeholder={placeholder}
                name={name || 'textarea'}
                value={value}
                onChange={handleChange}
                required={required}
                rows={rows}
                maxLength={maxLength}
                className={`w-full px-4.5 py-3.5 border border-black/20 text-sm resize-none focus:outline-none focus:border-black ${tailwind}`}
            />
            {showCharCount && (
                <div className="flex justify-end mt-2 absolute bottom-4 right-3">
                    <span className={`text-xs ${charCount >= maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                        {charCount}/{maxLength}
                    </span>
                </div>
            )}
        </div>
    );
}
