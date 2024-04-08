import { profileLink, unauthLinks } from './client-constants';
import ClientLink from './client-link';
import LogoutButton from './logout-btn';

type Props = { isAuthenticated: boolean };

export default function ClientAuthLinks({ isAuthenticated }: Props) {
  return isAuthenticated ? (
    <div className='hidden gap-4 md:flex'>
      <ClientLink href={profileLink.href} name={profileLink.name} />

      <LogoutButton />
    </div>
  ) : (
    <div className='hidden gap-4 md:flex'>
      {unauthLinks.map(({ name, href }) => (
        <ClientLink key={`${name}-link`} href={href} name={name} />
      ))}
    </div>
  );
}
