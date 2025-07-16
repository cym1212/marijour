import { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button/ColorButton';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { ArrowIcon } from '@/components/icons';

import type { CheckLabelBoxProps } from '@/types/ui';

gsap.registerPlugin(useGSAP);

export function CheckLabelBox({ id, label, description, required, modalContents, checked = false, onChange }: CheckLabelBoxProps) {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    const handleOpenModal = () => {
        setIsOpenModal(true);
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
        document.body.style.overflow = ''; // 스크롤 복원
    };

    // 모달 fade-in-out 애니메이션
    useGSAP(() => {
        const container = document.querySelector('.checkBoxModalContainer');

        if (isOpenModal) {
            gsap.to(container, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    }, [isOpenModal]);

    return (
        <>
            <div className="flex items-center justify-between w-full gap-x-2">
                <label className="flex items-center cursor-pointer">
                    <input
                        id={id}
                        type="checkbox"
                        className="peer sr-only"
                        required={required}
                        checked={checked}
                        onChange={handleCheckChange}
                    />
                    <span className="flex items-center justify-center w-[20px] h-[20px] border border-black/20 text-black/20 hover:border-primary transition-colors duration-300 peer-checked:bg-primary peer-checked:text-white">
                        <CheckIcon tailwind="w-[18px] h-[18px]" />
                    </span>
                    {label && <span className="text-sm ml-2">{label}</span>}
                    {description && <span className="text-sm text-black/40 ml-1">{description}</span>}
                </label>
                {modalContents && (
                    <button
                        type="button"
                        className="p-1"
                        onClick={handleOpenModal}
                    >
                        <ArrowIcon
                            tailwind="text-black w-4 h-4"
                            rotate="90"
                        />
                    </button>
                )}
            </div>
            {modalContents && isOpenModal && (
                <div className="checkBoxModalContainer fixed top-0 left-0 w-full h-full overflow-hidden z-10000 opacity-0">
                    <div
                        className="checkBoxModalOveray fixed bg-black/60 w-full h-full"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="checkBoxModalContent fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] overflow-y-auto bg-white">
                        <div className="flex items-center justify-end p-2">
                            <button
                                className="closeBtn p-3.5"
                                aria-label="메뉴 닫기"
                                type="button"
                                onClick={handleCloseModal}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="px-5 pb-5 max-h-[50vh] overflow-y-auto">{modalContents}</div>
                        <div className="p-5 w-full">
                            <ColorButton
                                type="button"
                                colorType="white"
                                tailwind="w-full px-4.5 py-3.5"
                                onClick={handleCloseModal}
                            >
                                확인
                            </ColorButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
