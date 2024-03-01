/** @type {import('next').NextConfig} */
// See backend/launchSettings.json for details on dev-env

const nextConfig = {
  distDir: "build",
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chewiesald2ijhpvmb34c.blob.core.windows.net",
        port: "",
        pathname: "/employees/**",
      },
    ],
  },
};

module.exports = nextConfig;
