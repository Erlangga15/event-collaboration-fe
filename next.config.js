/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  reactStrictMode: true,
  swcMinify: true
};

module.exports = nextConfig;
