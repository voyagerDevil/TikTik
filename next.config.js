/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["xsgames.co", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
