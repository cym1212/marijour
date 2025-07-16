import { LabelInput, TextInput, WarningLabel } from '@/components/ui/input';

import type { OrdererInfoSectionProps } from '@/types/order';

export function OrdererInfoSection({ name, email, orderPhoneNumber, isLoggedIn, userInfo, errors, handleNameChange, handleNameBlur, handleEmailChange, handleEmailBlur, handleOrderPhoneNumberChange, handleOrderPhoneNumberBlur }: OrdererInfoSectionProps) {
    return (
        <div className="pt-6 pb-3 border-t border-black">
            <div>
                <h3 className="font-bold">주문자 정보</h3>
            </div>
            <div className="w-full space-y-6 my-6">
                <LabelInput
                    label="이름"
                    htmlFor="name"
                    validateContent={errors.name && <WarningLabel message={errors.name} />}
                >
                    <TextInput
                        type="text"
                        id="name"
                        placeholder="이름을 입력해주세요"
                        value={isLoggedIn && userInfo ? userInfo.name : name}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        readOnly={isLoggedIn && !!userInfo}
                    />
                </LabelInput>
                <LabelInput
                    label="이메일"
                    htmlFor="email"
                    validateContent={errors.email && <WarningLabel message={errors.email} />}
                >
                    <TextInput
                        type="email"
                        id="email"
                        placeholder="이메일을 입력해주세요"
                        value={isLoggedIn && userInfo ? userInfo.email : email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        readOnly={isLoggedIn && !!userInfo}
                    />
                </LabelInput>
                <LabelInput
                    label="휴대폰 번호"
                    htmlFor="orderPhoneNumber"
                    validateContent={errors.orderPhoneNumber && <WarningLabel message={errors.orderPhoneNumber} />}
                >
                    <TextInput
                        type="tel"
                        id="orderPhoneNumber"
                        placeholder="휴대폰 번호를 입력해주세요"
                        value={orderPhoneNumber}
                        onChange={handleOrderPhoneNumberChange}
                        onBlur={handleOrderPhoneNumberBlur}
                    />
                </LabelInput>
            </div>
        </div>
    );
}
