import { useState } from 'react';
import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useDaumPostcodePopup } from 'react-daum-postcode';

import { ArrowIcon } from '@/components/icons';
import { CouponModal } from '@/components/ui/modal';
import { DeliveryInfoSection, OrdererInfoSection, OrderItemsSection, CouponRewardSection, PaymentMethodSection, RefundAccountSection, OrderSummary } from '@/components/ui/order';

import { ORDER_MOCK_DATA } from '@/constants/order';

import type { Route } from './+types';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

export function meta() {
    return [
        {
            title: '주문서 - Marijour',
        },
        {
            name: 'description',
            content: '주문서를 작성하고 결제를 진행하세요. 배송 정보와 결제 방법을 선택해주세요.',
        },
        {
            name: 'keywords',
            content: '주문서, 결제, 배송정보, 주문, 구매, 마리쥬르',
        },
    ];
}

export async function clientLoader({ request, params }: Route.LoaderArgs) {
    return {
        data: ORDER_MOCK_DATA,
    };
}

/**
 * Order 페이지 - 주문서 작성
 * 주문자 정보, 배송 정보, 결제 방법 선택 및 주문 진행
 *
 * 주의: 현재 폼 유효성 검사는 임시 검사로, 내부 기획에 따라 재정의 필요
 */
export default function Order({ loaderData }: Route.ComponentProps) {
    const { data } = loaderData;
    const navigate = useNavigate();
    const openDaumPostCode = useDaumPostcodePopup();

    // 주문자 정보 상태 관리
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [orderPhoneNumber, setOrderPhoneNumber] = useState<string>('');

    // 배송 정보 상태 관리
    const [recipient, setRecipient] = useState<string>('');
    const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<string>('');
    const [zonecode, setZoneCode] = useState<string>('');
    const [roadAddress, setRoadAddress] = useState<string>('');
    const [detailAddress, setDetailAddress] = useState<string>('');
    const [deliveryRequest, setDeliveryRequest] = useState<string>('');
    const [customDeliveryRequest, setCustomDeliveryRequest] = useState<string>('');

    // 결제 정보 상태 관리
    const [paymentMethod, setPaymentMethod] = useState<string>('bankTransfer');
    const [paymentBank, setPaymentBank] = useState<string>('');

    // 쿠폰/적립금 상태 관리
    const [coupon, setCoupon] = useState<string>('');
    const [reward, setReward] = useState<string>('0');

    // 환불 계좌 상태 관리
    const [depositor, setDepositor] = useState<string>('');
    const [refundBank, setRefundBank] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<string>('');

    // 모달 상태 관리
    const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);

    // 임시: 사용 가능한 쿠폰 목록 (추후 API에서 가져올 예정)
    const [availableCoupons] = useState([
        {
            id: '1',
            name: '신규회원 10% 할인',
            discountAmount: 10,
            discountType: 'percentage' as const,
            expiryDate: '2024.12.31',
        },
        {
            id: '2',
            name: '5000원 즉시할인',
            discountAmount: 5000,
            discountType: 'amount' as const,
            expiryDate: '2024.11.30',
        },
    ]);

    // 임시: 로그인 유저 정보 (추후 실제 로그인 상태 관리로 대체)
    // 로그인 시 하단 주문자 정보는 자동으로 채워짐
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);

    // 배송 요청사항 옵션
    const deliveryRequestOptions = [
        { value: 'door', label: '문 앞에 놔주세요.' },
        { value: 'security', label: '부재 시 경비실에 맡겨주세요.' },
        { value: 'locker', label: '택배함에 넣어주세요.' },
        { value: 'call', label: '배송 전 연락주세요.' },
        { value: 'direct', label: '직접 받겠습니다. (부재 시 문 앞)' },
        { value: 'caution', label: '파손위험 상품입니다. 배송 시 주의해주세요.' },
        { value: 'custom', label: '직접 입력' },
    ];

    // 배송 요청사항 값을 라벨로 변환
    const getDeliveryRequestValue = () => {
        if (deliveryRequest === 'custom') {
            return customDeliveryRequest.trim();
        }
        const option = deliveryRequestOptions.find((opt) => opt.value === deliveryRequest);
        return option ? option.label : '';
    };

    // 에러 상태 관리
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 휴대폰 번호 유효성 검사
    const isPhoneValid = (phone: string) => {
        const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
        return phoneRegex.test(phone);
    };

    // 이메일 유효성 검사
    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 개별 필드 에러 설정
    const setFieldError = (field: string, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    // 개별 필드 에러 제거
    const clearFieldError = (field: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    // 이름 유효성 검사
    const validateName = (value: string) => {
        if (!value.trim()) {
            setFieldError('name', '이름을 입력해주세요.');
            return false;
        }
        clearFieldError('name');
        return true;
    };

    // 이메일 유효성 검사
    const validateEmail = (value: string) => {
        if (!value.trim()) {
            setFieldError('email', '이메일을 입력해주세요.');
            return false;
        }
        if (!isEmailValid(value)) {
            setFieldError('email', '올바른 이메일 형식을 입력해주세요.');
            return false;
        }
        clearFieldError('email');
        return true;
    };

    // 주문자 휴대폰 번호 유효성 검사
    const validateOrderPhoneNumber = (value: string) => {
        if (!value.trim()) {
            setFieldError('orderPhoneNumber', '휴대폰 번호를 입력해주세요.');
            return false;
        }
        if (!isPhoneValid(value)) {
            setFieldError('orderPhoneNumber', '올바른 휴대폰 번호 형식을 입력해주세요.');
            return false;
        }
        clearFieldError('orderPhoneNumber');
        return true;
    };

    // 수령인 유효성 검사
    const validateRecipient = (value: string) => {
        if (!value.trim()) {
            setFieldError('recipient', '수령인을 입력해주세요.');
            return false;
        }
        clearFieldError('recipient');
        return true;
    };

    // 배송지 휴대폰 번호 유효성 검사
    const validateDeliveryPhoneNumber = (value: string) => {
        if (!value.trim()) {
            setFieldError('deliveryPhoneNumber', '휴대폰 번호를 입력해주세요.');
            return false;
        }
        if (!isPhoneValid(value)) {
            setFieldError('deliveryPhoneNumber', '올바른 휴대폰 번호 형식을 입력해주세요.');
            return false;
        }
        clearFieldError('deliveryPhoneNumber');
        return true;
    };

    // 주소 유효성 검사
    const validateAddress = () => {
        if (!zonecode.trim() || !roadAddress.trim()) {
            setFieldError('address', '주소 검색을 통해 주소를 입력해주세요.');
            return false;
        }
        clearFieldError('address');
        return true;
    };

    // 배송 요청사항 유효성 검사
    const validateDeliveryRequest = () => {
        if (deliveryRequest === 'custom' && !customDeliveryRequest.trim()) {
            setFieldError('deliveryRequest', '배송 요청사항을 입력해주세요.');
            return false;
        }
        clearFieldError('deliveryRequest');
        return true;
    };

    // 결제 방법 유효성 검사
    const validatePayment = () => {
        if (paymentMethod === 'bankTransfer' && !paymentBank.trim()) {
            setFieldError('paymentBank', '입금하실 은행을 선택해주세요.');
            return false;
        }
        clearFieldError('paymentBank');
        return true;
    };

    // 예금주 유효성 검사
    const validateDepositor = (value: string) => {
        if (!value.trim()) {
            setFieldError('depositor', '예금주를 입력해주세요.');
            return false;
        }
        clearFieldError('depositor');
        return true;
    };

    // 환불 은행 유효성 검사
    const validateRefundBank = (value: string) => {
        if (!value.trim()) {
            setFieldError('refundBank', '환불 은행을 선택해주세요.');
            return false;
        }
        clearFieldError('refundBank');
        return true;
    };

    // 계좌번호 유효성 검사
    const validateAccountNumber = (value: string) => {
        if (!value.trim()) {
            setFieldError('accountNumber', '계좌번호를 입력해주세요.');
            return false;
        }
        // 계좌번호는 숫자와 하이픈만 허용
        const accountRegex = /^[0-9-]+$/;
        if (!accountRegex.test(value)) {
            setFieldError('accountNumber', '올바른 계좌번호 형식을 입력해주세요.');
            return false;
        }
        clearFieldError('accountNumber');
        return true;
    };

    // 전체 폼 유효성 검사
    const validateForm = () => {
        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);
        const isOrderPhoneValid = validateOrderPhoneNumber(orderPhoneNumber);
        const isRecipientValid = validateRecipient(recipient);
        const isDeliveryPhoneValid = validateDeliveryPhoneNumber(deliveryPhoneNumber);
        const isAddressValid = validateAddress();
        const isDeliveryRequestValid = validateDeliveryRequest();
        const isPaymentValid = validatePayment();
        const isDepositorValid = validateDepositor(depositor);
        const isRefundBankValid = validateRefundBank(refundBank);
        const isAccountNumberValid = validateAccountNumber(accountNumber);

        return isNameValid && isEmailValid && isOrderPhoneValid && isRecipientValid && isDeliveryPhoneValid && isAddressValid && isDeliveryRequestValid && isPaymentValid && isDepositorValid && isRefundBankValid && isAccountNumberValid;
    };

    // 주문 요약 계산
    const calculateOrderSummary = () => {
        const totalOriginalPrice = data.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
        const productDiscountAmount = data.items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
        const totalPrice = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // 쿠폰 할인 계산
        let couponDiscountAmount = 0;
        if (coupon) {
            const selectedCoupon = availableCoupons.find((c) => c.name === coupon);
            if (selectedCoupon) {
                if (selectedCoupon.discountType === 'percentage') {
                    couponDiscountAmount = Math.floor(totalPrice * (selectedCoupon.discountAmount / 100));
                } else {
                    couponDiscountAmount = selectedCoupon.discountAmount;
                }
            }
        }

        // 적립금 할인
        const rewardDiscountAmount = parseInt(reward) || 0;

        // 총 할인 금액
        const totalDiscountAmount = productDiscountAmount + couponDiscountAmount + rewardDiscountAmount;

        // 최종 결제 금액
        const finalPrice = Math.max(0, totalPrice - couponDiscountAmount - rewardDiscountAmount);

        return {
            totalOriginalPrice,
            totalDiscountAmount,
            totalPrice: finalPrice,
            deliveryFee: data.deliveryFee,
            couponDiscountAmount,
            rewardDiscountAmount,
        };
    };

    const orderSummary = calculateOrderSummary();

    // 주문하기 핸들러
    const handleOrder = () => {
        // 폼 요소를 찾아서 제출 이벤트 발생
        navigate('/order-complete');
    };

    // 폼 초기화 함수
    const resetForm = () => {
        setName('');
        setEmail('');
        setOrderPhoneNumber('');
        setRecipient('');
        setDeliveryPhoneNumber('');
        setZoneCode('');
        setRoadAddress('');
        setDetailAddress('');
        setDeliveryRequest('');
        setCustomDeliveryRequest('');
        setPaymentMethod('bankTransfer');
        setPaymentBank('');
        setCoupon('');
        setReward('0');
        setDepositor('');
        setRefundBank('');
        setAccountNumber('');
        setErrors({});
    };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            // 첫 번째 에러 필드로 GSAP ScrollTo로 스크롤
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const element = document.getElementById(firstErrorField);
                if (element) {
                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: {
                            y: element,
                            offsetY: 100,
                        },
                        ease: 'power2.out',
                        onComplete: () => {
                            element.focus();
                        },
                    });
                }
            }
            return;
        }

        // 폼 데이터 구성
        const formData = {
            // 주문자 정보
            name: name.trim(),
            email: email.trim(),
            orderPhoneNumber: orderPhoneNumber.trim(),
            // 배송 정보
            recipient: recipient.trim(),
            deliveryPhoneNumber: deliveryPhoneNumber.trim(),
            zonecode: zonecode.trim(),
            roadAddress: roadAddress.trim(),
            detailAddress: detailAddress.trim(),
            deliveryRequest: getDeliveryRequestValue(),
            // 결제 정보
            paymentMethod: paymentMethod,
            paymentBank: paymentBank,
            // 쿠폰/적립금
            coupon: coupon,
            reward: reward,
            // 환불 계좌 정보
            depositor: depositor.trim(),
            refundBank: refundBank,
            accountNumber: accountNumber.trim(),
        };

        // 추후 API 호출 로직 추가 예정

        // 주문 성공 처리
        const orderNumber = 'ORD' + Date.now(); // 임시 주문번호 생성
        alert(`주문이 완료되었습니다!\n주문번호: ${orderNumber}\n\n주문 정보를 확인하시려면 마이페이지를 방문해주세요.`);
        resetForm(); // 폼 초기화
        navigate('/order-complete'); // 추후 주문 완료 페이지 구현 시 활성화
    };

    // 주소 검색 핸들러
    const handleSearchAddress = () => {
        openDaumPostCode({
            popupKey: 'address',
            onComplete: handleSearchAddressComplete,
        });
    };

    const handleSearchAddressComplete = (data: any) => {
        const { zonecode, roadAddress } = data;
        setZoneCode(zonecode);
        setRoadAddress(roadAddress);
    };

    // 이름 변경 핸들러
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (errors.name) {
            validateName(value);
        }
    };

    // 이메일 변경 핸들러
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.email) {
            validateEmail(value);
        }
    };

    // 주문자 휴대폰 번호 변경 핸들러
    const handleOrderPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOrderPhoneNumber(value);
        if (errors.orderPhoneNumber) {
            validateOrderPhoneNumber(value);
        }
    };

    // 수령인 변경 핸들러
    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRecipient(value);
        if (errors.recipient) {
            validateRecipient(value);
        }
    };

    // 배송지 휴대폰 번호 변경 핸들러
    const handleDeliveryPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDeliveryPhoneNumber(value);
        if (errors.deliveryPhoneNumber) {
            validateDeliveryPhoneNumber(value);
        }
    };

    // 상세주소 변경 핸들러
    const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDetailAddress(value);
    };

    // 배송 요청사항 변경 핸들러
    const handleDeliveryRequestChange = (value: string) => {
        setDeliveryRequest(value);
        if (value !== 'custom') {
            setCustomDeliveryRequest('');
            clearFieldError('deliveryRequest');
        }
    };

    // 직접 입력 배송 요청사항 변경 핸들러
    const handleCustomDeliveryRequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomDeliveryRequest(value);
        if (errors.deliveryRequest) {
            validateDeliveryRequest();
        }
    };

    // 결제 방법 변경 핸들러
    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPaymentMethod(value);
        // 결제 방법이 변경되면 은행 선택 초기화
        setPaymentBank('');
    };

    // 입금 은행 변경 핸들러
    const handlePaymentBankChange = (value: string) => {
        setPaymentBank(value);
    };

    // 쿠폰 적용 핸들러
    const handleSearchCoupon = () => {
        setIsCouponModalOpen(true);
    };

    // 쿠폰 모달 닫기 핸들러
    const handleCloseCouponModal = () => {
        setIsCouponModalOpen(false);
    };

    // 쿠폰 적용 완료 핸들러
    const handleApplyCoupon = (couponName: string) => {
        setCoupon(couponName);
    };

    // 적립금 입력 변경 핸들러
    const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용 (쉼표 제거)
        const numericValue = parseInt(value) || 0;

        // 최대 사용 가능 적립금 제한 (임시: 10,000원)
        const maxReward = 10000;
        const finalValue = Math.min(numericValue, maxReward);

        setReward(String(finalValue));
    };

    // 적립금 모두 사용 핸들러
    const handleSearchReward = () => {
        // 추후 사용 가능한 적립금 전체 적용 로직 예정
        setReward('10000'); // 임시: 10,000원 적용
    };

    // 환불 계좌 핸들러들
    const handleDepositorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDepositor(value);
        if (errors.depositor) {
            validateDepositor(value);
        }
    };

    const handleDepositorBlur = () => validateDepositor(depositor);

    const handleRefundBankChange = (value: string) => {
        setRefundBank(value);
        if (errors.refundBank) {
            validateRefundBank(value);
        }
    };

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAccountNumber(value);
        if (errors.accountNumber) {
            validateAccountNumber(value);
        }
    };

    const handleAccountNumberBlur = () => validateAccountNumber(accountNumber);

    // Blur 핸들러들
    const handleNameBlur = () => validateName(name);
    const handleEmailBlur = () => validateEmail(email);
    const handleOrderPhoneNumberBlur = () => validateOrderPhoneNumber(orderPhoneNumber);
    const handleRecipientBlur = () => validateRecipient(recipient);
    const handleDeliveryPhoneNumberBlur = () => validateDeliveryPhoneNumber(deliveryPhoneNumber);

    useGSAP(() => {
        gsap.to('.orderContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="orderContainer opacity-0">
            <section className="globalWrapper w-full pt-8 md:py-10 flex flex-col md:flex-row gap-10 items-center justify-between mb-5 md:mb-10">
                <div className="flex items-center gap-3 font-serif text-3xl">
                    <h2>주문서</h2>
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-black/40">장바구니</p>
                    <span>
                        <ArrowIcon
                            tailwind="w-[16px] h-[16px] text-black/40 hover-black-40"
                            rotate="90"
                        />
                    </span>
                    <p className="text-primary font-bold">주문서 작성</p>
                    <span>
                        <ArrowIcon
                            tailwind="w-[16px] h-[16px] text-black/40 hover-black-40"
                            rotate="90"
                        />
                    </span>
                    <p className="text-black/40">주문 완료</p>
                </div>
            </section>
            <section className="globalWrapper mb-20 relative flex flex-col md:flex-row items-start justify-between gap-5">
                <div className="flex-1 w-full">
                    <form
                        onSubmit={handleSubmit}
                        aria-label="주문서 작성 폼"
                    >
                        {/* 배송 정보 */}
                        <DeliveryInfoSection
                            recipient={recipient}
                            deliveryPhoneNumber={deliveryPhoneNumber}
                            zonecode={zonecode}
                            roadAddress={roadAddress}
                            detailAddress={detailAddress}
                            deliveryRequest={deliveryRequest}
                            customDeliveryRequest={customDeliveryRequest}
                            errors={errors}
                            handleRecipientChange={handleRecipientChange}
                            handleRecipientBlur={handleRecipientBlur}
                            handleDeliveryPhoneNumberChange={handleDeliveryPhoneNumberChange}
                            handleDeliveryPhoneNumberBlur={handleDeliveryPhoneNumberBlur}
                            handleSearchAddress={handleSearchAddress}
                            handleDetailAddressChange={handleDetailAddressChange}
                            handleDeliveryRequestChange={handleDeliveryRequestChange}
                            handleCustomDeliveryRequestChange={handleCustomDeliveryRequestChange}
                            deliveryRequestOptions={deliveryRequestOptions}
                        />

                        {/* 주문자 정보 */}
                        <OrdererInfoSection
                            name={name}
                            email={email}
                            orderPhoneNumber={orderPhoneNumber}
                            isLoggedIn={isLoggedIn}
                            userInfo={userInfo}
                            errors={errors}
                            handleNameChange={handleNameChange}
                            handleNameBlur={handleNameBlur}
                            handleEmailChange={handleEmailChange}
                            handleEmailBlur={handleEmailBlur}
                            handleOrderPhoneNumberChange={handleOrderPhoneNumberChange}
                            handleOrderPhoneNumberBlur={handleOrderPhoneNumberBlur}
                        />

                        {/* 주문상품 정보 */}
                        <OrderItemsSection
                            items={data.items.map((item) => ({
                                ...item,
                                id: item.id,
                            }))}
                        />

                        {/* 쿠폰/적립금 */}
                        <CouponRewardSection
                            coupon={coupon}
                            reward={reward}
                            errors={errors}
                            handleSearchCoupon={handleSearchCoupon}
                            handleSearchReward={handleSearchReward}
                            handleRewardChange={handleRewardChange}
                            availableCoupons={availableCoupons}
                        />

                        {/* 결제 방법 */}
                        <PaymentMethodSection
                            paymentMethod={paymentMethod}
                            paymentBank={paymentBank}
                            errors={errors}
                            handlePaymentMethodChange={handlePaymentMethodChange}
                            handlePaymentBankChange={handlePaymentBankChange}
                        />

                        {/* 환불 계좌 */}
                        <RefundAccountSection
                            depositor={depositor}
                            refundBank={refundBank}
                            accountNumber={accountNumber}
                            errors={errors}
                            handleDepositorChange={handleDepositorChange}
                            handleDepositorBlur={handleDepositorBlur}
                            handleRefundBankChange={handleRefundBankChange}
                            handleAccountNumberChange={handleAccountNumberChange}
                            handleAccountNumberBlur={handleAccountNumberBlur}
                        />
                    </form>
                </div>
                <div className="w-full md:w-[360px] md:shrink-0 md:sticky md:top-[60px] border-t border-black pt-6 md:border-t-0 md:pt-0">
                    <OrderSummary
                        totalPrice={orderSummary.totalPrice}
                        totalOriginalPrice={orderSummary.totalOriginalPrice}
                        totalDiscountAmount={orderSummary.totalDiscountAmount}
                        deliveryFee={orderSummary.deliveryFee}
                        couponDiscountAmount={orderSummary.couponDiscountAmount}
                        rewardDiscountAmount={orderSummary.rewardDiscountAmount}
                        onOrder={handleOrder}
                    />
                </div>
            </section>

            {/* 쿠폰 모달 */}
            {isCouponModalOpen && (
                <CouponModal
                    isOpen={isCouponModalOpen}
                    onClose={handleCloseCouponModal}
                    onApplyCoupon={handleApplyCoupon}
                    availableCoupons={availableCoupons}
                />
            )}
        </div>
    );
}
