/**
 * SelectBox 컴포넌트 - 커스텀 드롭다운 선택 박스
 * @param name - 입력 필드 이름
 * @param required - 필수 선택 여부
 * @param value - 선택된 값
 * @param onChange - 값 변경 핸들러
 * @param placeholder - 플레이스홀더 텍스트
 * @param options - 선택 옵션 배열
 * @param tailwind - 추가 CSS 클래스
 * @param id - 선택 박스 고유 ID
 */
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ArrowIcon } from '@/components/icons/ArrowIcon';

import type { SelectBoxProps } from '@/types/ui';

gsap.registerPlugin(useGSAP);
export function SelectBox({ name, required, value, onChange, placeholder, options, tailwind, id }: SelectBoxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === value) || null);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    // GSAP 애니메이션 설정
    useGSAP(() => {
        const dropdown = dropdownRef.current;
        const arrow = arrowRef.current;

        if (dropdown) {
            if (isOpen) {
                // 드롭다운 열기: 위에서 아래로 fade-in
                gsap.fromTo(
                    dropdown,
                    {
                        opacity: 0,
                        y: -10,
                        scaleY: 0,
                        transformOrigin: 'top',
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.3,
                        ease: 'power2.out',
                    }
                );
            }
        }

        if (arrow) {
            // 화살표 회전 애니메이션
            gsap.to(arrow, {
                rotation: isOpen ? 180 : 0,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    }, [isOpen]);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 옵션 선택 핸들러
    const handleOptionSelect = (option: { value: string; label: string }) => {
        setSelectedOption(option);
        onChange(option.value);
        setIsOpen(false);
    };

    // 키보드 이벤트 핸들러
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(!isOpen);
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            }
        }
    };

    return (
        <div
            className={`relative ${tailwind}`}
            ref={selectRef}
        >
            {/* Hidden input for form submission */}
            <input
                type="hidden"
                name={name}
                value={value}
                required={required}
            />

            <button
                type="button"
                id={id}
                className="w-full px-4.5 py-3.5 border border-black/20 text-sm text-left bg-white flex items-center justify-between hover:border-black/40 focus:outline-none focus:border-black"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={selectedOption ? 'text-black' : 'text-black/40'}>{selectedOption?.label || placeholder}</span>
                <div ref={arrowRef}>
                    <ArrowIcon
                        tailwind="w-4 h-4"
                        rotate="180"
                    />
                </div>
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-black/20 shadow-lg max-h-60 overflow-y-auto"
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`w-full px-4.5 py-3.5 text-sm text-left hover:bg-black/5 focus:outline-none focus:bg-black/5 ${selectedOption?.value === option.value ? 'bg-black/10 font-medium' : ''}`}
                            onClick={() => handleOptionSelect(option)}
                            role="option"
                            aria-selected={selectedOption?.value === option.value}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
