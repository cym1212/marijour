import { Link } from 'react-router';

import type { OrderItem } from '@/types/order';

export function OrderItem({ id, thumbnailUrl, name, quantity, price }: Omit<OrderItem, 'discountRate' | 'originalPrice'>) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-[50px] md:w-[70px] h-[50px] md:h-[70px] shrink-0">
                <Link to={`/products/${id}`}>
                    <img
                        src={thumbnailUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </Link>
            </div>
            <div className="space-y-1 md:space-y-2">
                <p className="text-sm font-bold line-clamp-2">{name}</p>
                <div className="flex items-center gap-1 text-sm">
                    <p>{quantity}개</p>
                    <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                    <p>{(price * quantity).toLocaleString()}원</p>
                </div>
            </div>
        </div>
    );
}
