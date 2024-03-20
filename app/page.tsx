import ClientAppBar from './components/layout/client-appbar';
import Footer from './components/layout/footer';

export default function X() {
  return (
    <main className='flex min-h-screen flex-col'>
      <ClientAppBar />

      <Footer />
    </main>
  );
}
