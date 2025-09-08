// components/Footer.tsx
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRing, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faPinterestP, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Toaster } from 'react-hot-toast';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const Footer = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      await axios.post('/api/newsletter', data, { timeout: 5000 });
      toast.success('Subscribed successfully!');
      reset();
    } catch  {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white pt-12 pb-6">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FontAwesomeIcon icon={faRing} className="text-white" />
              <span className="text-2xl logo-text text-white">ShaadiSharthi</span>
            </div>
            <p className="text-gray-400 mb-4">India&apos;s premier wedding planning platform connecting couples with the best wedding vendors.</p>
            <div className="flex space-x-4">
  <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300" aria-label="Facebook">
    <FontAwesomeIcon icon={faFacebookF} className="text-white" />
  </a>
  <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300" aria-label="Instagram">
    <FontAwesomeIcon icon={faInstagram} className="text-white" />
  </a>
  <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300" aria-label="Pinterest">
    <FontAwesomeIcon icon={faPinterestP} className="text-white"/>
  </a>
  <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300" aria-label="YouTube">
    <FontAwesomeIcon icon={faYoutube} className="text-white" />
  </a>
</div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 font-playfair-display text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#home" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Home</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Services</Link></li>
              <li><Link href="#about" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">About Us</Link></li>
              <li><Link href="#testimonials" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Testimonials</Link></li>
              <li><Link href="#contact" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 font-playfair-display text-white">Services</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Photography</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Venues</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Catering</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Decorations</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-pink-400 transition duration-300">Wedding Planning</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 font-playfair-display text-white">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to get wedding tips and vendor offers</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex">
              <input type="email" placeholder="Your email" {...register('email')} className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-800 w-full" />
              <button type="submit" disabled={isSubmitting} className="bg-primary dark:bg-pink-600 hover:bg-opacity-90 px-4 rounded-r-lg transition duration-300">
                <FontAwesomeIcon icon={faPaperPlane} className="text-white"/>
              </button>
            </form>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 ShaadiSharthi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;