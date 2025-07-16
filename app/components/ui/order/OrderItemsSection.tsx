import { OrderItem } from '@/components/ui/order/OrderItem';

import type { OrderItemsSectionProps } from '@/types/order';

export function OrderItemsSection({ items }: OrderItemsSectionProps) {
    return (
        <div className="pt-6 pb-3 border-t border-black">
            <div>
                <h3 className="font-bold">주문상품 정보</h3>
            </div>
            <div className="w-full my-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="py-4 border-b border-black/10 last:border-b-0"
                    >
                        <OrderItem
                            id={item.id}
                            thumbnailUrl={item.thumbnailUrl}
                            name={item.name}
                            quantity={item.quantity}
                            price={item.price}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
