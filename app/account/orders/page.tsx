import { AccountLayout } from '@/components/layout/account';
import { ClientLayout } from '@/components/layout/client';

export default function OrderHistory() {
  return (
    <ClientLayout>
      <AccountLayout>
        <div>Order History</div>
      </AccountLayout>
    </ClientLayout>
  );
}
