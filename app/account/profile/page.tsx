import { AccountLayout } from '@/components/layout/account';
import { ClientLayout } from '@/components/layout/client';

export default function Profile() {
  return (
    <ClientLayout>
      <AccountLayout>
        <div>Profile</div>
      </AccountLayout>
    </ClientLayout>
  );
}
