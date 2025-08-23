// components/Nav.tsx (CLIENT COMPONENT)
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRing, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Nav: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faRing} className="text-primary text-2xl" />
            <span className="text-2xl logo-text text-primary">ShaadiSharthi</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#home" className="text-gray-700 hover:text-primary font-medium transition duration-300">Home</Link>
            <Link href="#services" className="text-gray-700 hover:text-primary font-medium transition duration-300">Services</Link>
            <Link href="#about" className="text-gray-700 hover:text-primary font-medium transition duration-300">About Us</Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-primary font-medium transition duration-300">Testimonials</Link>
            <Link href="#contact" className="text-gray-700 hover:text-primary font-medium transition duration-300">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-transparent hover:shadow-lg text-primary py-2 px-4 border border-primary rounded-full transition duration-300"
            >
              Login
            </button>
            <Link
              href="http://localhost:3000/verify-email" // External URL for service provider
              className="btn-primary hover:shadow-lg text-white py-2 px-4 rounded-full transition duration-300"
            >
              Register
            </Link>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 focus:outline-none">
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} pb-4`}>
          <Link href="#home" className="block py-2 text-gray-700 hover:text-primary transition duration-300">Home</Link>
          <Link href="#services" className="block py-2 text-gray-700 hover:text-primary transition duration-300">Services</Link>
          <Link href="#about" className="block py-2 text-gray-700 hover:text-primary transition duration-300">About Us</Link>
          <Link href="#testimonials" className="block py-2 text-gray-700 hover:text-primary transition duration-300">Testimonials</Link>
          <Link href="#contact" className="block py-2 text-gray-700 hover:text-primary transition duration-300">Contact</Link>
          <button
            onClick={() => router.push('/login')}
            className="block py-2 text-gray-700 hover:text-primary transition duration-300"
          >
            Login
          </button>
          <Link href="http://localhost:3000/verify-email" className="block py-2 text-gray-700 hover:text-primary transition duration-300">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;