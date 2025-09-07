import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    domains: ['res.cloudinary.com', 'ui-avatars.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '', // Leave empty for default HTTPS port (443)
        pathname: '/**', // Allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**', // Allow portrait images from randomuser.me
      },
    ], 
  
  },
  basePath: '/customer',
  /* config options here */
};

export default nextConfig;
