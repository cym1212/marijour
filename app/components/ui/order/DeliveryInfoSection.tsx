import { LabelInput, TextInput, SelectBox, WarningLabel } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';

import type { DeliveryInfoSectionProps } from '@/types/order';

export function DeliveryInfoSection({
    recipient,
    deliveryPhoneNumber,
    zonecode,
    roadAddress,
    detailAddress,
    deliveryRequest,
    customDeliveryRequest,
    errors,
    handleRecipientChange,
    handleRecipientBlur,
    handleDeliveryPhoneNumberChange,
    handleDeliveryPhoneNumberBlur,
    handleSearchAddress,
    handleDetailAddressChange,
    handleDeliveryRequestChange,
    handleCustomDeliveryRequestChange,
    deliveryRequestOptions,
}: DeliveryInfoSectionProps) {
    return (
        <div className="pt-6 border-t border-black">
            <div className="flex items-center justify-between">
                <h3 className="font-bold">배송 정보</h3>
                <p className="text-xs text-black/40">
                    <span className="text-primary">*</span> 표시는 필수입력 항목
                </p>
            </div>
            <div className="w-full space-y-6 my-6">
                <LabelInput
                    label="수령인"
                    htmlFor="recipient"
                    validateContent={errors.recipient && <WarningLabel message={errors.recipient} />}
                >
                    <TextInput
                        type="text"
                        id="recipient"
                        placeholder="수령인을 입력해주세요"
                        value={recipient}
                        onChange={handleRecipientChange}
                        onBlur={handleRecipientBlur}
                    />
                </LabelInput>
                <LabelInput
                    label="휴대폰 번호"
                    htmlFor="deliveryPhoneNumber"
                    validateContent={errors.deliveryPhoneNumber && <WarningLabel message={errors.deliveryPhoneNumber} />}
                >
                    <TextInput
                        type="tel"
                        id="deliveryPhoneNumber"
                        placeholder="휴대폰 번호를 입력해주세요"
                        value={deliveryPhoneNumber}
                        onChange={handleDeliveryPhoneNumberChange}
                        onBlur={handleDeliveryPhoneNumberBlur}
                    />
                </LabelInput>
                <LabelInput
                    label="주소"
                    htmlFor="address"
                    validateContent={errors.address && <WarningLabel message={errors.address} />}
                >
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <TextInput
                                type="text"
                                id="zonecode"
                                placeholder="우편 번호"
                                value={zonecode}
                                tailwind="flex-1"
                                readOnly
                            />
                            <ColorButton
                                type="button"
                                colorType="primary"
                                onClick={handleSearchAddress}
                                aria-label="주소 검색"
                                tailwind="w-[100px] py-2 text-sm"
                            >
                                주소 검색
                            </ColorButton>
                        </div>
                        <TextInput
                            type="text"
                            id="roadAddress"
                            placeholder="도로명 주소"
                            value={roadAddress}
                            tailwind="w-full"
                            readOnly
                        />
                        <TextInput
                            type="text"
                            id="detailAddress"
                            placeholder="상세 주소를 입력해주세요"
                            value={detailAddress}
                            onChange={handleDetailAddressChange}
                            tailwind="w-full"
                        />
                    </div>
                </LabelInput>
                <LabelInput
                    label="배송 요청사항"
                    htmlFor="deliveryRequest"
                    validateContent={errors.deliveryRequest && <WarningLabel message={errors.deliveryRequest} />}
                >
                    <SelectBox
                        name="deliveryRequest"
                        id="deliveryRequest"
                        value={deliveryRequest}
                        placeholder="배송 요청사항을 선택해주세요"
                        options={deliveryRequestOptions}
                        onChange={handleDeliveryRequestChange}
                    />
                    {deliveryRequest === 'custom' && (
                        <TextInput
                            type="text"
                            id="customDeliveryRequest"
                            placeholder="배송 요청사항을 직접 입력해주세요"
                            value={customDeliveryRequest}
                            onChange={handleCustomDeliveryRequestChange}
                            tailwind="mt-2"
                        />
                    )}
                </LabelInput>
            </div>
        </div>
    );
}
