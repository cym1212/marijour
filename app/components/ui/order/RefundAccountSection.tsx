import { LabelInput, TextInput, SelectBox, WarningLabel } from '@/components/ui/input';

import type { RefundAccountSectionProps } from '@/types/order';

export function RefundAccountSection({ depositor, refundBank, accountNumber, errors, handleDepositorChange, handleDepositorBlur, handleRefundBankChange, handleAccountNumberChange, handleAccountNumberBlur }: RefundAccountSectionProps) {
    return (
        <div className="pt-6 border-t border-black">
            <div className="flex items-center justify-between">
                <h3 className="font-bold">환불 계좌</h3>
            </div>
            <div className="w-full space-y-6 my-6">
                <LabelInput
                    label="예금주"
                    htmlFor="depositor"
                    validateContent={errors.depositor && <WarningLabel message={errors.depositor} />}
                >
                    <TextInput
                        type="text"
                        id="depositor"
                        placeholder="예금주를 입력해주세요"
                        value={depositor}
                        onChange={handleDepositorChange}
                        onBlur={handleDepositorBlur}
                    />
                </LabelInput>
                <LabelInput
                    label="입금 은행"
                    htmlFor="refundBank"
                    validateContent={errors.refundBank && <WarningLabel message={errors.refundBank} />}
                >
                    <SelectBox
                        name="refundBank"
                        id="refundBank"
                        value={refundBank}
                        placeholder="입금 하실 은행을 선택해주세요."
                        options={[
                            { value: 'kb', label: '국민은행' },
                            { value: 'ibk', label: '기업은행' },
                        ]}
                        onChange={handleRefundBankChange}
                    />
                </LabelInput>
                <LabelInput
                    label="계좌번호"
                    htmlFor="accountNumber"
                    validateContent={errors.accountNumber && <WarningLabel message={errors.accountNumber} />}
                >
                    <TextInput
                        type="text"
                        id="accountNumber"
                        placeholder="계좌번호를 입력해주세요"
                        value={accountNumber}
                        onChange={handleAccountNumberChange}
                        onBlur={handleAccountNumberBlur}
                    />
                </LabelInput>
            </div>
        </div>
    );
}
