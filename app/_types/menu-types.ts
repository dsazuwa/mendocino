export type MenuItem = {
  itemId: number;
  name: string;
  description?: string;
  tags: string[];
  price?: number;
  photoUrl: string;
  notes?: string;
};

export type SubCategory = {
  name?: string;
  items: MenuItem[];
};

export type CategorizedMenu = {
  category: string;
  notes?: string[];
  subCategories: SubCategory[];
};

export type GroupedMenuResponse = {
  menu: CategorizedMenu[];
  categories: string[];
};

export type OrderMenu = {
  category: string;
  notes?: string[];
  items: MenuItem[];
}[];

export type OrderMenuResponse = {
  menu: OrderMenu;
  message: string;
};

export type ModifierOption = {
  optionId: number;
  name: string;
  price?: number;
  isDefault: boolean;
};

export type NestedOption = {
  groupId: number;
  name: string;
  price?: number;
  isDefault: boolean;
};

export type Modifier = {
  groupId: number;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
  maxFree: number;
  name: string;
  options: (ModifierOption | NestedOption)[];
};

export type ChildModifier = {
  name: string;
  modifiers: Modifier[];
};
