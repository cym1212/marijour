import { Link } from 'react-router';

import { ArrowIcon } from '@/components/icons';
import { ColorButton } from '@/components/ui/button';
import { OrderItem } from '@/components/ui/order/OrderItem';

import type { OrderListProps, OrderListItem } from '@/types/order';

export function OrderList({ orders, btnText, btnHandler, btnHref }: OrderListProps) {
    const handleClick = (orderNumber: string, item: OrderListItem) => {
        if (btnHandler) {
            btnHandler(orderNumber, item);
        }
    };

    return (
        <ul className="flex flex-col gap-[42px]">
            {orders.map((order, index) => (
                <li
                    className="border-t border-black"
                    key={order.orderNumber}
                >
                    <div className="flex items-center gap-2 py-4">
                        <p className="font-bold">{order.orderDate}</p>
                        <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                        <Link
                            className="flex items-center gap-1 text-sm text-black/60 hover-primary"
                            to={`/my-page/orders/detail/${order.orderNumber}`}
                        >
                            <span>주문 번호 : {order.orderNumber}</span>
                            <ArrowIcon
                                tailwind="w-[16px] h-[16px]"
                                rotate="90"
                            />
                        </Link>
                    </div>
                    <ul>
                        {order.items.map((item, index) => (
                            <li
                                className="flex items-center justify-between gap-5 border-t border-black/10 py-4"
                                key={item.id}
                            >
                                <div className="flex-1">
                                    <OrderItem
                                        id={item.id}
                                        thumbnailUrl={item.thumbnailUrl}
                                        name={item.name}
                                        quantity={item.quantity}
                                        price={item.price}
                                    />
                                </div>
                                <div className="flex items-center gap-15">
                                    <p className="text-primary font-bold">{item.orderStatus}</p>
                                    {btnText && btnText.length > 0 && (
                                        <ColorButton
                                            type="button"
                                            colorType="grayLine"
                                            tailwind="text-sm px-6 py-1.5"
                                            onClick={() => handleClick(order.orderNumber, item)}
                                            to={btnHref}
                                        >
                                            {btnText}
                                        </ColorButton>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}
