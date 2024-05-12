import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import { deleteAddress } from '@/app/actions/address';
import Delete from '../icons/delete';
import Loader from '../loader';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

type Props = { id: number; handleSuccess: () => void };

export default function DeleteAddress({ id, handleSuccess }: Props) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(deleteAddress, {
    isSuccess: false,
    message: '',
  });

  const handleDelete = () => {
    setIsLoading(true);
    void formAction(id);
  };

  useEffect(() => {
    if (state.message === '') return;

    setIsLoading(false);

    if (state.isSuccess) {
      handleSuccess();
    } else {
      toast({ variant: 'destructive', description: state.message });
    }
  }, [state, handleSuccess, toast]);

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
