import { MenuItem, Modifier, ModifierOption, NestedOption } from '@/types/menu';
import { isOptionNested } from './typeguard';
import { ItemNode, ModifierNode, OptionNode } from './types';

export const createItemNode = (item: MenuItem): ItemNode => {
  const { itemId, name, description, price, photoUrl } = item;

  return {
    itemId,
    key: `i${itemId}`,
    name,
    description,
    photoUrl,
    price: price || 0,
    children: [],
    isValid: false,
    quantity: 1,
  };
};

export const createModifierNode = (
  modifier: Modifier,
  parentNode: ItemNode | OptionNode,
): ModifierNode => {
  const { groupId, isRequired, maxSelection, minSelection, name } = modifier;

  const node = {
    key: `${parentNode.key}-m${groupId}`,
    groupId,
    isRequired,
    maxSelection,
    minSelection,
    name,
    parent: parentNode.key,
    children: [],
    isValid: false,
  };

  parentNode.children.push(node.key);

  return node;
};

export const createOptionNode = (
  option: ModifierOption | NestedOption,
  parentNode: ModifierNode,
): OptionNode => {
  const isNested = isOptionNested(option);

  const id = isNested ? option.groupId : option.optionId;
  const key = isNested
    ? `${parentNode.key}-n${id}`
    : `${parentNode.key}-o${id}`;

  const name = option.name;
  const price = option.price;

  const node = {
    key,
    id,
    name,
    price: price || 0,
    parent: parentNode.key,
    isNested,
    children: [],
    isFulfilled: !isNested,
    isSelected: option.isDefault || false,
    isValid: false,
  };

  parentNode.children.push(key);

  return node;
};
