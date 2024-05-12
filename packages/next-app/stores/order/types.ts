import { MenuItem, Modifier } from '@/types/menu';

export type OrderState = {
  map: TreeMap;
  root: ItemNode | OptionNode | undefined;
  current: ItemNode | OptionNode | undefined;
};

// export type TreeMap = Map<string, ItemNode | ModifierNode | OptionNode>;
export type TreeMap = {
  [nodeId: string]: ItemNode | ModifierNode | OptionNode;
};

export type TBuildTree = {
  item: MenuItem;
  modifiers: Modifier[];
};

export type TAddTreeNodes = {
  parentKey: string;
  modifiers: Modifier[];
};

export type TSetQuantity = {
  key: string;
  quantity: number;
};

export type TSelectOption = {
  key: string;
  index: number;
};

export type ItemNode = {
  itemId: number;
  key: string;
  name: string;
  description?: string;
  price: number;
  photoUrl: string;
  children: string[]; //  ModifierNode[]
  isValid: boolean;
  quantity: number;
};

export type ModifierNode = {
  key: string;
  groupId: number;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
  name: string;
  parent: string; //  ItemNode | OptionNode
  children: string[]; //  OptionNode[]
  isValid: boolean;
};

export type OptionNode = {
  key: string;
  id: number;
  name: string;
  price: number;
  parent: string; //  ModifierNode
  children: string[]; //  ModifierNode[]
  isFulfilled: boolean;
  isNested: boolean;
  isSelected: boolean;
  isValid: boolean;
};
