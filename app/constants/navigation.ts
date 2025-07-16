import type { GNBData, QuickMenuData } from '@/types/navigation';

export const GNB_MOCK_DATA: GNBData[] = [
    {
        to: '/shop',
        label: 'Shop',
        children: [
            {
                to: '/shop/best',
                label: 'Best',
                children: [],
            },
            {
                to: '/shop/kitchen-dining',
                label: '키친&다이닝',
                children: [
                    {
                        to: '/shop/kitchen-dining/bowls',
                        label: '그릇',
                    },
                    {
                        to: '/shop/kitchen-dining/cups',
                        label: '컵',
                    },
                ],
            },
            {
                to: '/shop/body-care',
                label: '바디케어',
                children: [
                    {
                        to: '/shop/body-care/oral-care',
                        label: '구강케어',
                    },
                    {
                        to: '/shop/body-care/skin-care',
                        label: '스킨케어',
                    },
                ],
            },
            {
                to: '/shop/bedroom-fabric',
                label: '침실&패브릭',
                children: [
                    {
                        to: '/shop/bedroom-fabric/homewear',
                        label: '홈웨어',
                    },
                    {
                        to: '/shop/bedroom-fabric/mattress-cover',
                        label: '매트리스 커버&이불',
                    },
                ],
            },
        ],
    },
    {
        to: '/about',
        label: 'About',
        children: [],
    },
    {
        to: '/notice',
        label: 'Notice',
    },
    {
        to: '/review',
        label: 'Review',
    },
];

export const QUICK_MENU_MOCK_DATA: QuickMenuData[] = [
    {
        to: '/shop',
        label: '전체',
        thumbnailUrl: '/images/quick-menu-all.jpg',
    },
    {
        to: '/shop/best',
        label: 'Best',
        thumbnailUrl: '/images/quick-menu-best.jpg',
    },
    {
        to: '/shop/kitchen-diningbowls',
        label: '그릇',
        thumbnailUrl: '/images/quick-menu-bowl.jpg',
    },
    {
        to: '/shop/kitchen-dining/cups',
        label: '컵',
        thumbnailUrl: '/images/quick-menu-cup.jpg',
    },
    {
        to: '/shop/body-care/oral-care',
        label: '구강케어',
        thumbnailUrl: '/images/quick-menu-oralcare.jpg',
    },
    {
        to: '/shop/body-care/skin-care',
        label: '스킨케어',
        thumbnailUrl: '/images/quick-menu-skincare.jpg',
    },
    {
        to: '/shop/bedroom-fabric/homewear',
        label: '홈웨어',
        thumbnailUrl: '/images/quick-menu-homewear.jpg',
    },
    {
        to: '/shop/bedroom-fabric/mattress-cover',
        label: '패브릭',
        thumbnailUrl: '/images/quick-menu-fabric.jpg',
    },
];
