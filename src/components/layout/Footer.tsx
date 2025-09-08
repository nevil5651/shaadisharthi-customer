import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaPinterest, FaYoutube, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">ShaadiSharthi</h3>
            <p className="text-gray-300 mb-4">Your one-stop platform for crafting unforgettable weddings with ease.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Pinterest">
                <FaPinterest />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services?category=Photographers" className="text-gray-300 hover:text-white">Photography</Link></li>
              <li><Link href="/services?category=Venues" className="text-gray-300 hover:text-white">Venues</Link></li>
              <li><Link href="/services?category=Caterers" className="text-gray-300 hover:text-white">Catering</Link></li>
              <li><Link href="/services?category=Decoration" className="text-gray-300 hover:text-white">Decoration</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Subscribe to get wedding tips and vendor offers</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-800 w-full"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-opacity-90 px-4 rounded-r-lg flex items-center justify-center"
                aria-label="Subscribe to newsletter"
              >
                <FaPaperPlane className="text-white" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; 2023 ShaadiSharthi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;