/** @type {import('next').NextConfig} */

const apiBackendUrl =
  process.env.NEXT_PUBLIC_VIBES_BACKEND_URL ?? "http://localhost:7172"; // See backend/launchSettings.json for details on dev-env

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
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
};

module.exports = nextConfig;
