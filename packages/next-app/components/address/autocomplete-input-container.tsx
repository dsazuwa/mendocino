import { ReactNode, SVGProps } from 'react';

type Props = {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  children?: ReactNode;
};

export default function InputContainer({ Icon, children }: Props) {
  return (
    <div className='flex min-h-12 w-full flex-row items-center gap-2 rounded-lg border border-neutral-200 px-2 py-1 shadow-sm has-[:focus-visible]:border-primary-700/30'>
      <Icon className='w-8 shrink-0 fill-neutral-600 p-2' />
      {children}
    </div>
  );
}
