import { ClientLayout, Footer } from './_components/layout';

export default function Home() {
  return (
    <ClientLayout>
      <main className='flex flex-1 flex-col'>
        <Footer />
      </main>
    </ClientLayout>
  );
}
