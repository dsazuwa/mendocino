import { Modifier } from '@/types/menu';
import { createModifierNode, createOptionNode } from './node-creators';
import {
  getItem,
  getModifier,
  getModifierParent,
  getOption,
} from './node-selectors';
import { validateModifier, validateOption } from './node-validators';
import { ItemNode, OptionNode, OrderState } from './types';

export const buildModifiersAndOptions = (
  state: OrderState,
  modifiers: Modifier[],
  parent: ItemNode | OptionNode,
) => {
  modifiers?.forEach((modifier) => {
    const modifierNode = createModifierNode(modifier, parent);
    state.map[modifierNode.key] = modifierNode;

    modifier.options.forEach((option) => {
      const optionNode = createOptionNode(option, modifierNode);

      state.map[optionNode.key] = optionNode;
      validateOption(state.map, optionNode);
    });

    validateModifier(state.map, modifierNode);
  });
};

export const unselectOption = (state: OrderState, option: OptionNode) => {
  option.isSelected = false;
  validateOption(state.map, option);

  if (state.current)
    state.current = getModifierParent(state.map, state.current.key);
};

export const selectOption = (state: OrderState, key: string) => {
  const option = getOption(state.map, key);
  const parent = getModifier(state.map, option.parent);

  if (parent.maxSelection === 1)
    parent.children.forEach((key) => {
      const child = getOption(state.map, key);
      child.isSelected = false;
      validateOption(state.map, child);
    });

  option.isSelected = true;
  validateOption(state.map, option);

  if (option.isNested) state.current = option;
  else if (state.current)
    state.current = getModifierParent(state.map, state.current.key);
};

export const updateQuantity = (
  state: OrderState,
  key: string,
  newQuantity: number,
) => {
  if (newQuantity < 0 || newQuantity > 999) return;

  const node = getItem(state.map, key);
  node.quantity = newQuantity;
  state.map[key] = node;

  if (state.current && state.current.key === key) state.current = node;
};
