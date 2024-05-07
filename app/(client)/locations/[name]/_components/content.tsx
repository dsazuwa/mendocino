import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useOrderStore } from '@/app/providers/order-provider';
import Loader from '@/components/loader';
import { DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { SheetContent, SheetOverlay } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { isItemNode, isOptionNode } from '@/stores/order/typeguard';
import { ItemNode, OptionNode } from '@/stores/order/types';
import { MenuItem, Modifier } from '@/types/menu';
import ItemContent from './content-item';
import OptionContent from './content-option';
import { PreferencesContent } from './content-preferences';

type Props = { isDialog: boolean; item: MenuItem };

export default function Content({ isDialog, item }: Props) {
  const Overlay = isDialog ? DialogOverlay : SheetOverlay;
  const Comp = isDialog ? DialogContent : SheetContent;

  const [isLoading, setIsLoading] = useState(true);
  const [openPreferences, setOpenPreferences] = useState(false);

  const current = useOrderStore((state) => state.current);
  const buildTree = useOrderStore((state) => state.buildTree);
  const addTreeNodes = useOrderStore((state) => state.addTreeNodes);

  const { data } = useQuery<Modifiers>({
    queryKey: ['item-modifiers'],
    queryFn: () => getModifiers(item.itemId),
  });

  const { data: childModifiers, refetch: fetchChildModifiers } =
    useQuery<ChildModifiers>({
      queryKey: ['child-modifiers'],
      queryFn: () => getChildModifiers(current),
      enabled: false,
    });

  useEffect(() => {
    if (data) {
      buildTree(item, data.modifiers);
      setIsLoading(false);
    }
  }, [item, data]);

  useEffect(() => {
    if (isOptionNode(current) && current.isNested && !current.isFulfilled) {
      setIsLoading(true);
      void fetchChildModifiers();
    }
  }, [current]);

  useEffect(() => {
    if (isOptionNode(current) && current.isNested && !current.isFulfilled) {
      if (childModifiers !== undefined) {
        addTreeNodes(current.key, childModifiers.modifiers);
        setIsLoading(false);
      }
    }
  }, [childModifiers]);

  return (
    <>
      {isLoading ? (
        <Overlay>
          <Loader className='h-full' />
        </Overlay>
      ) : (
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

type Modifiers = { modifiers: Modifier[] };
type ChildModifiers = { name: string; modifiers: Modifier[] };

async function getModifiers(id: number) {
  return (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/menu/modifiers/item/${id}`,
  ).then((res) => res.json())) as Modifiers;
}

async function getChildModifiers(current: ItemNode | OptionNode | undefined) {
  if (!isOptionNode(current)) throw new Error('');

  return (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/menu/modifiers/child/${current.id}`,
  ).then((res) => res.json())) as ChildModifiers;
}
