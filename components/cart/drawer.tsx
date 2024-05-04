import CartIcon from '../icons/cart';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export default function CartDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon'>
          <CartIcon className='w-3.5 fill-neutral-600' />
        </Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='flex max-h-screen w-80 flex-col bg-white'
      ></SheetContent>
    </Sheet>
  );
}
