import ClientLayout from './_components/layout/client-layout';
import Footer from './_components/layout/footer';

export default function Home() {
  return (
    <ClientLayout>
      <main className='flex flex-1 flex-col'>
        <Footer />
      </main>
    </ClientLayout>
  );
}
