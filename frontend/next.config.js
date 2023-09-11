/** @type {import('next').NextConfig} */

const apiBackendUrl =
  process.env.NEXT_PUBLIC_VIBES_BACKEND_URL ?? "http://localhost:7172";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBackendUrl}/:path*`,
      },
    ];
  },
  output: "standalone",
  distDir: "build",
};

module.exports = nextConfig;
