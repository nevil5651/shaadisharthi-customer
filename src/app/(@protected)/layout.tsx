import { getSession } from '@/lib/session';
import "../globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import ToastProvider from '@/components/ToastProvider'
import AuthHandler from '@/components/auth/AuthHandler'
import Providers from './services/components/providers';

interface LayoutProps {
  children: React.ReactNode;
}


export const metadata: Metadata = {
  title: 'ShaadiSharthi',
  description: 'Your one-stop platform for crafting unforgettable weddings with ease.',
}


export default async function ProtectedLayout({ children }: LayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <AuthProvider>
        <AuthHandler />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-8">
              <>
                <ToastProvider />
              </>
              <Providers>{children}</Providers>
            </div>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}