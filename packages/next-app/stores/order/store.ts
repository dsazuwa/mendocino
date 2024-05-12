/* eslint-disable @typescript-eslint/no-unused-vars */

import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { MenuItem, Modifier } from '@/types/menu';
import { createItemNode } from './node-creators';
import {
  getItem,
  getModifier,
  getModifierParent,
  getOption,
} from './node-selectors';
import { validateItem, validateOption } from './node-validators';
import {
  buildModifiersAndOptions,
  selectOption,
  unselectOption,
  updateQuantity,
} from './reducer-utils';
import { isOptionNode } from './typeguard';
import { OrderState, TreeMap } from './types';

export type OrderActions = {
  reset: () => void;
  buildTree: (item: MenuItem, modifiers: Modifier[]) => void;
  addTreeNodes: (parentKey: string, modifiers: Modifier[]) => void;
  returnToParent: (key: string) => void;
  singleSelectOption: (key: string, index: number) => void;
  multiSelectOption: (key: string, index: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  incrementQuantity: (key: string) => void;
  decrementQuantity: (key: string) => void;
};

export type OrderStore = OrderState & OrderActions;

export const defaultInitState: OrderState = {
  map: {},
  root: undefined,
  current: undefined,
};

export const createOrderStore = (initState: OrderState = defaultInitState) => {
  return createStore<OrderStore>()(
    immer((set) => ({
      ...initState,

      reset() {
        set(defaultInitState);
      },

      buildTree(item: MenuItem, modifiers: Modifier[]) {
        set(() => {
          const map: TreeMap = {};
          const root = createItemNode(item);
          map[root.key] = root;

          buildModifiersAndOptions(map, modifiers, root);

          validateItem(map, root);

          return { map, root, current: root };
        });
      },

      addTreeNodes(parentKey, modifiers) {
        set((state) => {
          const parent = state.map[parentKey];
          if (!isOptionNode(parent) || parent.isFulfilled) return;

          buildModifiersAndOptions(state.map, modifiers, parent);

          parent.isFulfilled = true;
          validateOption(state.map, parent);

          state.current = parent;
        });
      },

      returnToParent(key) {
        set((state) => {
          const option = getOption(state.map, key);
          const parent = getModifier(state.map, option.parent);
          const grandparent = getModifierParent(state.map, parent.parent);

          state.current = grandparent;
        });
      },

      singleSelectOption(key, index) {
        set((state) => {
          const modifier = getModifier(state.map, key);
          const option = getOption(state.map, modifier.children[index]);

          selectOption(state, option.key);
        });
      },

      multiSelectOption(key, index) {
        set((state) => {
          const { children, maxSelection } = getModifier(state.map, key);
          const option = getOption(state.map, children[index]);

          if (option.isSelected) {
            unselectOption(state, option);
            return;
          }

          const selectedCount = children.filter(
            (key) => getOption(state.map, key).isSelected,
          ).length;

          if (selectedCount < maxSelection) selectOption(state, option.key);
        });
      },

      setQuantity(key, quantity) {
        if (quantity < 0 || quantity > 999) return;

        set((state) => {
          updateQuantity(state, key, quantity);
        });
      },

      incrementQuantity(key) {
        set((state) => {
          const node = getItem(state.map, key);

          updateQuantity(state, key, node.quantity + 1);
        });
      },

      decrementQuantity(key) {
        set((state) => {
          const node = getItem(state.map, key);

          updateQuantity(state, key, node.quantity - 1);
        });
      },
    })),
  );
};
