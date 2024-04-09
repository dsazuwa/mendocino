import { ClientLayout } from '@/components/layout/client';
import Form from './_components/form';

export default function ChangePassword() {
  return (
    <ClientLayout>
      <div className='w-full flex-1 bg-neutral-50'>
        <Form />
      </div>
    </ClientLayout>
  );
}
