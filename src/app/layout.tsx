import { Poppins, Lora } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import QueryProvider from '@/components/QueryProvider';

export const metadata = {
  title: 'ShaadiSharthi - Your Wedding Planning Partner',
  description: "Discover India's finest wedding vendors and plan your perfect day with ease",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700']
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '500', '600', '700']
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`$ {poppins.variable} ${lora.variable}`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
