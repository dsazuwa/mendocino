import { useEffect } from 'react';

import { useDeleteAddressMutation } from '@/store/api/address';
import { useAppSelector } from '@/store/hooks';
import Delete from '../icons/delete';
import Loader from '../loader';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

type Props = { id: number; placeId: string; handleSuccess: () => void };

export default function DeleteAddress({ id, placeId, handleSuccess }: Props) {
  const { toast } = useToast();

  const guestSession = useAppSelector(
    (state) => state.addressState.guestSession,
  );

  const [deleteAddress, { isLoading, isSuccess, isError, error }] =
    useDeleteAddressMutation();

  const handleDelete = () => {
    void deleteAddress({ id, placeId, guestSession });
  };

  useEffect(() => {
    if (isSuccess) handleSuccess();
  }, [isSuccess]);

  useEffect(() => {
    if (isError)
      toast({ variant: 'destructive', description: error as string });
  }, [isError, error]);

  return (
    <Button variant='ghost' size='icon' onClick={handleDelete}>
      {isLoading ? (
        <Loader size='sm' />
      ) : (
        <Delete className='h-4 w-4 fill-neutral-500' />
      )}
    </Button>
  );
}
