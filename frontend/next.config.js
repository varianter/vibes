/** @type {import('next').NextConfig} */

const apiBackendUrl =
  process.env.NEXT_PUBLIC_VIBES_BACKEND_URL ?? "https://localhost:5039"; // See backend/launchSettings.json for details on dev-env

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
