import { LabelInput, TextInput, WarningLabel } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';

import type { CouponRewardSectionProps } from '@/types/order';

export function CouponRewardSection({ coupon, reward, errors, handleSearchCoupon, handleSearchReward, handleRewardChange, availableCoupons }: CouponRewardSectionProps) {
    return (
        <div className="pt-6 border-t border-black">
            <div className="flex items-center justify-between">
                <h3 className="font-bold">쿠폰/적립금</h3>
            </div>
            <div className="w-full space-y-6 my-6">
                <LabelInput
                    label="쿠폰"
                    htmlFor="coupon"
                    validateContent={errors.coupon && <WarningLabel message={errors.coupon} />}
                >
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <TextInput
                                type="text"
                                id="coupon"
                                placeholder="쿠폰을 선택해주세요"
                                value={coupon}
                                tailwind="flex-1"
                                readOnly
                            />
                            <ColorButton
                                type="button"
                                colorType="primary"
                                onClick={handleSearchCoupon}
                                aria-label="쿠폰 적용"
                                tailwind="w-[100px] py-2 text-sm"
                            >
                                쿠폰 적용
                            </ColorButton>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-black/40">
                            <p>
                                사용 가능 <span className="text-primary">{availableCoupons.length}</span>개
                            </p>
                            <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                            <p>
                                보유 <span className="text-primary">{availableCoupons.length}</span>개
                            </p>
                        </div>
                    </div>
                </LabelInput>
                <LabelInput
                    label="적립금"
                    htmlFor="reward"
                    validateContent={errors.reward && <WarningLabel message={errors.reward} />}
                >
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <TextInput
                                type="text"
                                id="reward"
                                placeholder="0"
                                value={reward ? parseInt(reward).toLocaleString() : ''}
                                onChange={handleRewardChange}
                                tailwind="flex-1"
                            />
                            <ColorButton
                                type="button"
                                colorType="primary"
                                onClick={handleSearchReward}
                                aria-label="모두 사용"
                                tailwind="w-[100px] py-2 text-sm"
                            >
                                모두 사용
                            </ColorButton>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-black/40">
                            <p>
                                사용 가능 <span className="text-primary">10,000</span>원
                            </p>
                            <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                            <p>
                                보유 <span className="text-primary">15,000</span>원
                            </p>
                        </div>
                    </div>
                </LabelInput>
            </div>
        </div>
    );
}
