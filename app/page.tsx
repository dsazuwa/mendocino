import { ClientLayout, Footer } from './components/layout';

export default function Home() {
  return (
    <ClientLayout>
      <main className='flex min-h-[calc(100vh-48px)] flex-col'>
        <Footer />
      </main>
    </ClientLayout>
  );
}
