import { ComponentSkinProps } from '@wcbuilder/core';

export interface QuickMenuItem {
  to: string;
  label: string;
  thumbnailUrl: string;
}

export interface QuickMenuData {
  items: QuickMenuItem[];
}

export type QuickMenuSkinProps = ComponentSkinProps<QuickMenuData>;