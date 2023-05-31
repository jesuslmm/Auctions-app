/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "upload.wikimedia.org", "placekitten.com"],
  },
};

module.exports = nextConfig;
