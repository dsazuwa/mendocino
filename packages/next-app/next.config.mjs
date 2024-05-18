/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'maps.googleapis.com', 'www.adampack.com'],
  },

  logging: {
    fetches: { fullUrl: true },
  },
};

export default nextConfig;
