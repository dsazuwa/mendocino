import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useOrderStore } from '@/app/providers/order-provider';
import Loader from '@/components/loader';
import { DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { SheetContent, SheetOverlay } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  useGetItemModifiersQuery,
  useLazyGetChildModifierQuery,
} from '@/redux/api/modifier';
import { isItemNode, isOptionNode } from '@/stores/order/typeguard';
import { MenuItem } from '@/types/menu';
import ItemContent from './content-item';
import OptionContent from './content-option';
import { PreferencesContent } from './content-preferences';

type Props = {
  isDialog: boolean;
  item: MenuItem;
  handleClose: () => void;
  setLoadingFeatured?: Dispatch<SetStateAction<boolean>>;
};

export default function Content({
  isDialog,
  item,
  handleClose,
  setLoadingFeatured,
}: Props) {
  const Overlay = isDialog ? DialogOverlay : SheetOverlay;
  const Comp = isDialog ? DialogContent : SheetContent;

  const [isLoading, setIsLoading] = useState(true);
  const [openPreferences, setOpenPreferences] = useState(false);

  const current = useOrderStore((state) => state.current);
  const buildTree = useOrderStore((state) => state.buildTree);
  const addTreeNodes = useOrderStore((state) => state.addTreeNodes);

  const { data: modifiers } = useGetItemModifiersQuery(item.itemId);

  const [fetchChildModifiers, { data: childModifiers }] =
    useLazyGetChildModifierQuery(undefined);

  const setLoading = (val: boolean) => {
    setIsLoading(val);
    if (setLoadingFeatured) setLoadingFeatured(val);
  };

  useEffect(() => {
    if (modifiers) {
      buildTree(item, modifiers.modifiers);
      setLoading(false);
    }
  }, [item, modifiers]);

  useEffect(() => {
    if (isOptionNode(current) && current.isNested && !current.isFulfilled) {
      setLoading(true);
      void fetchChildModifiers(current.id);
    }
  }, [current]);

  useEffect(() => {
    if (isOptionNode(current) && current.isNested && !current.isFulfilled) {
      if (childModifiers !== undefined) {
        addTreeNodes(current.key, childModifiers.modifiers);
        setLoading(false);
      }
    }
  }, [childModifiers]);

  return (
    <>
      {isLoading && setLoadingFeatured === undefined && (
        <Overlay onClick={handleClose}>
          <Loader className='h-full' />
        </Overlay>
      )}

      {!isLoading && (
        <Comp
          className={cn({
            'flex max-h-[95vh] max-w-[560px] flex-col': isDialog,
            'flex h-full w-full flex-col': !isDialog,
          })}
          side='left'
        >
          {openPreferences ? (
            <PreferencesContent back={() => setOpenPreferences(false)} />
          ) : (
            <>
              {isItemNode(current) && (
                <ItemContent
                  isDialog={isDialog}
                  current={current}
                  openPreferences={() => setOpenPreferences(true)}
                />
              )}

              {isOptionNode(current) && current.children.length > 0 && (
                <OptionContent itemName={item.name} current={current} />
              )}
            </>
          )}
        </Comp>
      )}
    </>
  );
}
