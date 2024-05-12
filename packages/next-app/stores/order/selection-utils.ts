import { ItemNode, ModifierNode, OptionNode, TreeMap } from './types';
import { getModifier, getOption } from './node-selectors';

export const getItemSelectionPrice = (map: TreeMap, item: ItemNode) =>
  item.children.reduce(
    (price, child) =>
      price + getModfierSelectionPrice(map, getModifier(map, child)),
    item.price,
  );

export const getModfierSelectionPrice = (
  map: TreeMap,
  modifier: ModifierNode,
): number =>
  modifier.children.reduce((price, child) => {
    const option = getOption(map, child);

    return (
      price +
      (option.isSelected
        ? option.price + getOptionSelectionPrice(map, option)
        : 0)
    );
  }, 0);

export const getOptionSelectionPrice = (
  map: TreeMap,
  option: OptionNode,
): number =>
  option.children.reduce(
    (price, child) =>
      price + getModfierSelectionPrice(map, getModifier(map, child)),
    0,
  );

export const getSelections = (map: TreeMap, item: ItemNode) =>
  item.children.flatMap((mKey) =>
    getModfierSelection(map, getModifier(map, mKey)),
  );

export const getModfierSelection = (map: TreeMap, modifier: ModifierNode) =>
  modifier.children.flatMap((oKey) =>
    getOptionSelection(map, getOption(map, oKey)),
  );

export const getOptionSelection = (map: TreeMap, option: OptionNode) => {
  if (!option.isSelected) return [];

  const selection = [{ [option.key]: option.name }];

  if (option.isNested)
    selection.push(
      ...option.children.flatMap((key) =>
        getModfierSelection(map, getModifier(map, key)),
      ),
    );

  return selection;
};
