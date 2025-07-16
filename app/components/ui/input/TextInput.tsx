/**
 * TextInput 컴포넌트 - 텍스트 입력 필드
 * @param id - 입력 필드 고유 ID
 * @param type - 입력 타입 (text, email, password 등)
 * @param placeholder - 플레이스홀더 텍스트
 * @param value - 입력 값
 * @param onChange - 값 변경 핸들러
 * @param name - 입력 필드 이름
 * @param required - 필수 입력 여부
 * @param tailwind - 추가 CSS 클래스
 * @param readOnly - 읽기 전용 여부
 * @param onBlur - 포커스 해제 핸들러
 * @param disabled - 비활성화 여부
 */
import type { TextInputProps } from '@/types/ui';

export function TextInput({ id, type = 'text', placeholder, value, onChange, name, required, tailwind, readOnly, onBlur, disabled }: TextInputProps) {
    return (
        <input
            id={id}
            type={type}
            aria-labelledby={name || type}
            placeholder={placeholder}
            name={name || type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            className={`w-full px-4.5 py-3.5 border border-black/20 text-sm disabled:border-black/10 disabled:bg-black/3 disabled:text-black/60 ${tailwind}`}
            readOnly={readOnly}
            disabled={disabled}
        />
    );
}
