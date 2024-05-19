import { getModifier, getModifierParent, getOption } from './node-selectors';
import { isItemNode } from './typeguard';
import { ItemNode, ModifierNode, OptionNode, TreeMap } from './types';

export const validateItem = (map: TreeMap, item: ItemNode) => {
  item.isValid = item.children.every((key) => getModifier(map, key).isValid);
};

export const validateModifier = (map: TreeMap, modifier: ModifierNode) => {
  const numValid = modifier.children.filter((key) => {
    const node = getOption(map, key);
    return node.isSelected && node.isValid;
  }).length;

  modifier.isValid =
    numValid <= modifier.maxSelection && numValid >= modifier.minSelection;

  if (modifier.parent) {
    const parent = getModifierParent(map, modifier.parent);

    if (isItemNode(parent)) validateItem(map, parent);
    else validateOption(map, parent);
  }
};

export const validateOption = (map: TreeMap, option: OptionNode) => {
  option.isValid = option.children.every(
    (key) => getModifier(map, key).isValid,
  );

  const parent = getModifier(map, option.parent);
  validateModifier(map, parent);
};
