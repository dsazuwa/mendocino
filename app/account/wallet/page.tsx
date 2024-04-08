import { AccountLayout } from '@/components/layout/account';
import { ClientLayout } from '@/components/layout/client';

export default function Wallet() {
  return (
    <ClientLayout>
      <AccountLayout>
        <div>Wallet</div>
      </AccountLayout>
    </ClientLayout>
  );
}
