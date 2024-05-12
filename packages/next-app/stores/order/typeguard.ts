import { ModifierOption, NestedOption } from '@/types/menu';
import { ItemNode, ModifierNode, OptionNode } from './types';

export const isItemNode = (
  node: ItemNode | ModifierNode | OptionNode | undefined,
): node is ItemNode => !!node && 'itemId' in node;

export const isModifierNode = (
  node: ItemNode | ModifierNode | OptionNode | undefined,
): node is ModifierNode => !!node && 'groupId' in node;

export const isOptionNode = (
  node: ItemNode | ModifierNode | OptionNode | undefined,
): node is OptionNode => !!node && 'id' in node;

export const isOptionNested = (
  option: ModifierOption | NestedOption,
): option is NestedOption => 'groupId' in option;
