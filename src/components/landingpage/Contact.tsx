// components/Contact.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faPinterestP, faYoutube } from '@fortawesome/free-brands-svg-icons';
import SectionHeader from './SectionHeader';
import { Toaster } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

type FormData = z.infer<typeof schema>;

const Contact = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/contact', data, { timeout: 5000 });
      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <SectionHeader subtitle="GET IN TOUCH" title="We'd Love to Hear From You" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-6 font-playfair-display">Send us a Message</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Full Name</label>
                <input id="name" {...register('name')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address</label>
                <input id="email" type="email" {...register('email')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 mb-2 font-medium">Subject</label>
                <input id="subject" {...register('subject')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Message</label>
                <textarea id="message" rows={5} {...register('message')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full btn-primary hover:shadow-lg text-white py-3 rounded-lg transition duration-300">
                {isSubmitting ? 'Sending...' : 'Send Message'} <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
              </button>
            </form>
          </div>
          <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-6 font-playfair-display">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Our Location</h4>
                  <p className="text-gray-600">ShaadiSharthi Headquarters, 123 Wedding Street, Mumbai 400001, India</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faPhone} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Phone Number</h4>
                  <p className="text-gray-600">+91 98765 43210 (10AM - 7PM)</p>
                  <p className="text-gray-600">+91 87654 32109 (Emergency)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Email Address</h4>
                  <p className="text-gray-600">info@shaadisharthi.com</p>
                  <p className="text-gray-600">support@shaadisharthi.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faClock} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Working Hours</h4>
                  <p className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-600">Sunday: Emergency Support Only</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="font-bold mb-4 font-playfair-display">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-primary bg-opacity-10 hover:bg-primary p-3 rounded-full transition duration-300 group">
                  <FontAwesomeIcon icon={faFacebookF} className="text-white" />
                </a>
                <a href="#" className="bg-primary bg-opacity-10 hover:bg-primary p-3 rounded-full transition duration-300 group">
                  <FontAwesomeIcon icon={faInstagram} className="text-white" />
                </a>
                <a href="#" className="bg-primary bg-opacity-10 hover:bg-primary p-3 rounded-full transition duration-300 group">
                  <FontAwesomeIcon icon={faPinterestP} className="text-white" />
                </a>
                <a href="#" className="bg-primary bg-opacity-10 hover:bg-primary p-3 rounded-full transition duration-300 group">
                  <FontAwesomeIcon icon={faYoutube} className="text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;