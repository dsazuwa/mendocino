import HomePageContent from '@/components/home/page-content';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <>
      <main className='mx-auto w-full max-w-screen-lg flex-1 space-y-3 px-4 py-8 sm:px-8'>
        <HomePageContent />
      </main>

      <Footer />
    </>
  );
}
