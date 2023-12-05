/** @type {import('next').NextConfig} */
// See backend/launchSettings.json for details on dev-env

const nextConfig = {
  distDir: "build",
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
