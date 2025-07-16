import { SelectBox, WarningLabel } from '@/components/ui/input';

import type { PaymentMethodSectionProps } from '@/types/order';

export function PaymentMethodSection({ paymentMethod, paymentBank, errors, handlePaymentMethodChange, handlePaymentBankChange }: PaymentMethodSectionProps) {
    return (
        <div className="pt-6 border-t border-black">
            <div>
                <h3 className="font-bold">결제 방법</h3>
            </div>
            <div className="w-full space-y-6 my-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <input
                            id="bankTransfer"
                            type="radio"
                            name="paymentMethod"
                            value="bankTransfer"
                            className="hidden sr-only peer"
                            checked={paymentMethod === 'bankTransfer'}
                            onChange={handlePaymentMethodChange}
                        />
                        <label
                            htmlFor="bankTransfer"
                            className="border p-3 block text-sm cursor-pointer text-center border-primary text-primary font-normal peer-checked:bg-primary peer-checked:text-white peer-checked:font-bold peer-checked:hover-bg-primary-80 transition-colors duration-200"
                        >
                            무통장입금
                        </label>
                    </div>
                </div>
                <SelectBox
                    name="paymentBank"
                    id="paymentBank"
                    value={paymentBank}
                    placeholder="입금 하실 은행을 선택해주세요."
                    options={[{ value: '1234567890', label: 'KB 국민은행 1234567890 - 마리쥬르' }]}
                    onChange={handlePaymentBankChange}
                />
                {errors.paymentBank && <WarningLabel message={errors.paymentBank} />}
                <div className="text-xs text-black/40 leading-body">
                    <p>• 주문일 기준 '24시간' 이내까지 입금이 되지 않은 경우 주문이 취소 될 수 있습니다.</p>
                    <p>• 입금기한의 경우 주문 완료 후 일부 시점에 따라 차이가 있을 수 있습니다.</p>
                </div>
            </div>
        </div>
    );
}
