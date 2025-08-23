import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from '@/components/ToastProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'ShaadiSharthi',
  description: 'Your one-stop platform for crafting unforgettable weddings with ease.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
   <AuthProvider>
    <ToastProvider />
    {children}
    </AuthProvider>
      
  );
}
