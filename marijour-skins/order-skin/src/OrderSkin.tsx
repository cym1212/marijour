import React, { useState, useEffect, useRef } from 'react';
import { OrderSkinProps, OrderFormData, DeliveryInfo, OrdererInfo, RefundAccount } from './types';
import { OrderHeader } from './components/OrderHeader';
import { DeliveryInfoSection } from './components/DeliveryInfoSection';
import { OrdererInfoSection } from './components/OrdererInfoSection';
import { OrderItemsSection } from './components/OrderItemsSection';
import { CouponPointsSection } from './components/CouponPointsSection';
import { PaymentMethodSection } from './components/PaymentMethodSection';
import { RefundAccountSection } from './components/RefundAccountSection';
import { TermsSection } from './components/TermsSection';
import { OrderSummary } from './components/OrderSummary';
import './order-skin.scss';

const OrderSkin: React.FC<OrderSkinProps> = ({ data, utils, actions }) => {
  const {
    items = [],
    ordererInfo: prefilledOrderer,
    coupons = [],
    availablePoints = 0,
    paymentMethods = [
      { id: 'bank', name: '무통장입금', type: 'bank', enabled: true },
      { id: 'card', name: '신용카드', type: 'card', enabled: false },
      { id: 'virtual', name: '가상계좌', type: 'virtual', enabled: false }
    ],
    banks = [
      { code: '004', name: 'KB국민은행' },
      { code: '011', name: '농협은행' },
      { code: '020', name: '우리은행' },
      { code: '088', name: '신한은행' },
      { code: '090', name: '카카오뱅크' }
    ],
    deliveryRequests = [
      { value: 'door', label: '문 앞에 놓아주세요' },
      { value: 'security', label: '경비실에 맡겨주세요' },
      { value: 'call', label: '배송 전 연락주세요' },
      { value: 'direct', label: '직접 받을게요' },
      { value: 'custom', label: '직접 입력' }
    ],
    deliveryFee = 3000,
    freeShippingThreshold = 50000,
    showSameAsOrderer = true,
    showCoupon = true,
    showPoints = true,
    showRefundAccount = true,
    requireTermsAgreement = true,
    termsLinks = [
      { id: 'purchase', label: '구매조건 확인 및 결제대행 서비스 약관 동의', url: '/terms/purchase', required: true },
      { id: 'privacy', label: '개인정보 제3자 제공 동의', url: '/terms/privacy', required: true },
      { id: 'marketing', label: '마케팅 정보 수신 동의', url: '/terms/marketing', required: false }
    ]
  } = data || {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  
  // Form state
  const [formData, setFormData] = useState<OrderFormData>({
    deliveryInfo: {
      recipientName: '',
      recipientPhone: '',
      postalCode: '',
      roadAddress: '',
      detailAddress: '',
      deliveryRequest: 'door',
      customRequest: ''
    },
    ordererInfo: {
      name: prefilledOrderer?.name || '',
      email: prefilledOrderer?.email || '',
      phone: prefilledOrderer?.phone || ''
    },
    selectedCouponId: undefined,
    usedPoints: 0,
    paymentMethodId: paymentMethods.find(m => m.enabled)?.id || 'bank',
    refundAccount: {
      holderName: '',
      bankCode: '',
      accountNumber: ''
    },
    termsAgreed: {},
    sameAsOrderer: false
  });

  const [selectedBank, setSelectedBank] = useState('');

  // Page enter animation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  // Update delivery info
  const handleDeliveryChange = (field: keyof DeliveryInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryInfo: { ...prev.deliveryInfo, [field]: value }
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Update orderer info
  const handleOrdererChange = (field: keyof OrdererInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      ordererInfo: { ...prev.ordererInfo, [field]: value }
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Update refund account
  const handleRefundAccountChange = (field: keyof RefundAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      refundAccount: { ...prev.refundAccount!, [field]: value }
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Same as orderer
  const handleSameAsOrdererChange = (checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          sameAsOrderer: true,
          deliveryInfo: {
            ...prev.deliveryInfo,
            recipientName: prev.ordererInfo.name,
            recipientPhone: prev.ordererInfo.phone
          }
        };
      }
      return { ...prev, sameAsOrderer: false };
    });
  };

  // Address search
  const handleAddressSearch = () => {
    if (actions?.searchAddress) {
      actions.searchAddress((data: any) => {
        setFormData(prev => ({
          ...prev,
          deliveryInfo: {
            ...prev.deliveryInfo,
            postalCode: data.zonecode,
            roadAddress: data.roadAddress
          }
        }));
      });
    } else {
      alert('주소 검색 기능을 사용할 수 없습니다.');
    }
  };

  // Calculate order summary
  const calculateSummary = () => {
    const totalProductAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let productDiscountAmount = 0; // Could be calculated from original prices
    
    // Coupon discount
    let couponDiscountAmount = 0;
    if (formData.selectedCouponId) {
      const coupon = coupons.find(c => c.id === formData.selectedCouponId);
      if (coupon && (!coupon.minOrderAmount || totalProductAmount >= coupon.minOrderAmount)) {
        if (coupon.discountType === 'percent') {
          couponDiscountAmount = Math.floor(totalProductAmount * coupon.discountValue / 100);
        } else {
          couponDiscountAmount = coupon.discountValue;
        }
      }
    }
    
    // Delivery fee
    const subtotal = totalProductAmount - productDiscountAmount - couponDiscountAmount - formData.usedPoints;
    const deliveryFeeAmount = subtotal >= freeShippingThreshold ? 0 : deliveryFee;
    
    return {
      totalProductAmount,
      productDiscountAmount,
      couponDiscountAmount,
      pointsDiscountAmount: formData.usedPoints,
      deliveryFee: deliveryFeeAmount,
      totalPaymentAmount: Math.max(0, subtotal + deliveryFeeAmount)
    };
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, any> = {};
    
    // Delivery validation
    if (!formData.deliveryInfo.recipientName) {
      newErrors.recipientName = '받는 분 이름을 입력해주세요';
    }
    if (!formData.deliveryInfo.recipientPhone) {
      newErrors.recipientPhone = '연락처를 입력해주세요';
    }
    if (!formData.deliveryInfo.postalCode || !formData.deliveryInfo.roadAddress) {
      newErrors.address = '주소를 입력해주세요';
    }
    if (!formData.deliveryInfo.detailAddress) {
      newErrors.detailAddress = '상세주소를 입력해주세요';
    }
    
    // Orderer validation
    if (!formData.ordererInfo.name) {
      newErrors.ordererName = '주문자 이름을 입력해주세요';
    }
    if (!formData.ordererInfo.email) {
      newErrors.ordererEmail = '이메일을 입력해주세요';
    }
    if (!formData.ordererInfo.phone) {
      newErrors.ordererPhone = '연락처를 입력해주세요';
    }
    
    // Refund account validation
    if (showRefundAccount) {
      if (!formData.refundAccount?.holderName) {
        newErrors.holderName = '예금주를 입력해주세요';
      }
      if (!formData.refundAccount?.bankCode) {
        newErrors.bankCode = '은행을 선택해주세요';
      }
      if (!formData.refundAccount?.accountNumber) {
        newErrors.accountNumber = '계좌번호를 입력해주세요';
      }
    }
    
    // Terms validation
    if (requireTermsAgreement) {
      const requiredTerms = termsLinks.filter(t => t.required);
      const allRequiredAgreed = requiredTerms.every(t => formData.termsAgreed?.[t.id]);
      if (!allRequiredAgreed) {
        newErrors.terms = '필수 약관에 동의해주세요';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit order
  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (actions?.submitOrder) {
        await actions.submitOrder({
          ...formData,
          items,
          summary: calculateSummary()
        });
      } else if (utils?.navigate) {
        // Mock order complete
        utils.navigate('/order/complete?orderId=MOCK123');
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const summary = calculateSummary();
  const isValid = items.length > 0;

  return (
    <div className="order-skin" ref={containerRef}>
      <div className="order-container">
        <div className="order-content">
          <OrderHeader />
          
          <DeliveryInfoSection
            deliveryInfo={formData.deliveryInfo}
            deliveryRequests={deliveryRequests}
            errors={errors}
            onChange={handleDeliveryChange}
            onAddressSearch={handleAddressSearch}
          />
          
          <OrdererInfoSection
            ordererInfo={formData.ordererInfo}
            errors={errors}
            showSameAsOrderer={showSameAsOrderer}
            sameAsOrderer={formData.sameAsOrderer || false}
            onChange={handleOrdererChange}
            onSameAsOrdererChange={handleSameAsOrdererChange}
          />
          
          <OrderItemsSection items={items} />
          
          {(showCoupon || showPoints) && (
            <CouponPointsSection
              coupons={coupons}
              availablePoints={availablePoints}
              selectedCouponId={formData.selectedCouponId}
              usedPoints={formData.usedPoints}
              showCoupon={showCoupon}
              showPoints={showPoints}
              onCouponSelect={(id) => setFormData(prev => ({ ...prev, selectedCouponId: id }))}
              onPointsChange={(points) => setFormData(prev => ({ ...prev, usedPoints: points }))}
            />
          )}
          
          <PaymentMethodSection
            paymentMethods={paymentMethods}
            selectedMethodId={formData.paymentMethodId}
            selectedBank={selectedBank}
            banks={banks}
            onMethodChange={(id) => setFormData(prev => ({ ...prev, paymentMethodId: id }))}
            onBankChange={setSelectedBank}
          />
          
          {showRefundAccount && (
            <RefundAccountSection
              refundAccount={formData.refundAccount!}
              banks={banks}
              errors={errors}
              onChange={handleRefundAccountChange}
            />
          )}
          
          {requireTermsAgreement && (
            <TermsSection
              termsLinks={termsLinks}
              termsAgreed={formData.termsAgreed || {}}
              onTermsChange={(id, agreed) => 
                setFormData(prev => ({ 
                  ...prev, 
                  termsAgreed: { ...prev.termsAgreed, [id]: agreed } 
                }))
              }
              onTermsView={(url) => {
                if (utils?.navigate) {
                  utils.navigate(url);
                } else {
                  window.open(url, '_blank');
                }
              }}
            />
          )}
        </div>
        
        <div className="order-sidebar">
          <OrderSummary
            summary={summary}
            onSubmit={handleSubmit}
            isValid={isValid}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSkin;