import HomePageContent from '@/components/home/page-content';
import Footer from '@/components/layout/footer';
import useAuthentication from '@/hooks/use-auth';

export default function Home() {
  const { guestSession } = useAuthentication();

  return (
    <>
      <main className='mx-auto w-full max-w-screen-lg flex-1 space-y-3 px-4 py-8 sm:px-8'>
        <HomePageContent guestSession={guestSession} />
      </main>

      <Footer />
    </>
  );
}
