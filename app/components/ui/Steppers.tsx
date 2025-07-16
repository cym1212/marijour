import { PlusIcon, MinusIcon } from '@/components/icons';

export function Steppers({ count, setCount }: { count: number; setCount: (count: number) => void }) {
    const textColorClass = count < 1 ? 'text-black/40' : 'text-black';
    const disableBorderClass = count < 1 ? 'border-black/10 cursor-not-allowed' : 'border-black/20';
    const buttonClass = 'flex items-center justify-center p-1.5 bg-transparent border';

    return (
        <div className="flex items-center">
            <button
                className={[buttonClass, disableBorderClass].join(' ')}
                type="button"
                onClick={() => setCount(Math.max(count - 1, 0))}
            >
                <MinusIcon tailwind={`w-[12px] h-[12px] ${textColorClass}`} />
            </button>
            <input
                readOnly
                value={count}
                className="text-center text-sm w-[50px]"
            />
            <button
                className={`border-black/20 ${buttonClass}`}
                type="button"
                onClick={() => setCount(count + 1)}
            >
                <PlusIcon tailwind={'w-[12px] h-[12px]'} />
            </button>
        </div>
    );
}
