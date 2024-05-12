/* eslint-disable @typescript-eslint/no-unused-vars */

type MenuItem = {
  itemId: number;
  name: string;
  description: string;
  category: string;
  subCategory: string | null;
  tags: string[] | null;
  price: number;
  status: string;
  photoUrl: string;
};

type CategoryItems<T> = {
  category: string;
  notes: string[];
  items: T[];
};

interface ModifierOption {
  optionId: number;
  name: string;
  price: number;
}

interface NestedOption {
  groupId: number;
  name: string;
  price: number;
}

interface Modifier {
  group_id: number;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
  maxFree: number;
  name: string;
  options: (ModifierOption | NestedOption)[] | null;
}
