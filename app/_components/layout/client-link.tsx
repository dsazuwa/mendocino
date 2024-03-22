import Link from 'next/link';

type Props = { name: string; href: string };

export default function ClientLink({ name, href }: Props) {
  return (
    <Link href={href} className='text-xs font-semibold'>
      {name}
    </Link>
  );
}
