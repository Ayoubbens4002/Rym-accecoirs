import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BackButton from './BackButton';
import ScrollToTopButton from './ScrollToTopButton';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <BackButton />
        </div>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
