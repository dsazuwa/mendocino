import { isItemNode, isModifierNode, isOptionNode } from './typeguard';
import { TreeMap } from './types';

export const getItem = (map: TreeMap, key: string) => {
  const item = map[key];

  if (!isItemNode(item)) throw new Error('Invalid item node');

  return item;
};

export const getModifier = (map: TreeMap, key: string) => {
  const modifier = map[key];

  if (!isModifierNode(modifier)) throw new Error('Invalid modifier node');

  return modifier;
};

export const getModifierParent = (map: TreeMap, key: string) => {
  const node = map[key];

  if (isModifierNode(node) || node === undefined)
    throw new Error('Invalid modifier parent node');

  return node;
};

export const getOption = (map: TreeMap, key: string) => {
  const option = map[key];

  if (!isOptionNode(option)) throw new Error('Invalid option node');

  return option;
};
