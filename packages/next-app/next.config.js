// import dynamic from 'next/dynamic';
// const withBundleAnalyzer = dynamic(() => import('@next/bundle-analyzer')());

const withBundleAnalyzer = require('@next/bundle-analyzer')();

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

// export default nextConfig;
module.exports =
  process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;
