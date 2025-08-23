import { FaRing } from 'react-icons/fa';
import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 m-7 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <FaRing className="text-pink-500 text-4xl mr-2" />
          <span className="text-3xl font-bold text-gray-800 font-serif">ShaadiSharthi</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 font-serif">{title}</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}