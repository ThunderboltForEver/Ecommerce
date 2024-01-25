/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "carsguide-res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.gaw.to",
      },
      {
        protocol: "https",
        hostname: "www.forbes.com",
      },
      {
        protocol: "https",
        hostname: "cdn1.mecum.com",
      },
    ],
  },
};

module.exports = nextConfig;
