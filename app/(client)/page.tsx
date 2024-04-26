import AuthenticatedHomePage from '@/components/home/home-auth';
import UnauthHome from '@/components/home/home-unauth';
import Footer from '@/components/layout/footer';
import useAuthentication from '@/hooks/use-auth';

export default function Home() {
  const { isAuthenticated } = useAuthentication();

  return (
    <>
      <main className='mx-auto w-full max-w-screen-sm flex-1 space-y-3 px-4 py-8'>
        {isAuthenticated ? <AuthenticatedHomePage /> : <UnauthHome />}
      </main>

      <Footer />
    </>
  );
}
