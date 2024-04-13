/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },

  logging: {
    fetches: { fullUrl: true },
  },
};

export default nextConfig;
