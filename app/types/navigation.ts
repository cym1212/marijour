export interface NavigationItem {
    to: string;
    label: string;
}

export interface GNBData extends NavigationItem {
    children?: GNBData[];
}

export interface SideBarPropsType {
    isOpen: boolean;
    onClose?: () => void;
}

export interface QuickMenuData extends NavigationItem {
    thumbnailUrl: string;
}
