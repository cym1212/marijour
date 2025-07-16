import type { InfoDataListData } from '@/types/order';

export function InfoDataList({ data }: { data: InfoDataListData[] }) {
    return (
        <dl className="w-full space-y-2">
            {data.map((d, index) => (
                <div
                    key={index}
                    className={`flex items-center gap-4 ${d.isBetween ? 'justify-between' : ''}`}
                >
                    <dt className={`text-black/80 w-[100px] shrink-0 text-left ${d.isSmall ? 'text-xs' : 'text-sm'} ${d.isBold ? 'font-bold' : ''}`}>{d.dt}</dt>
                    <dd className={`text-right ${d.isSmall ? 'text-xs' : 'text-sm'} ${d.isBold ? 'font-bold' : ''}`}>{d.dd}</dd>
                </div>
            ))}
        </dl>
    );
}
