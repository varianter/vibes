/** @type {import('next').NextConfig} */
// See backend/launchSettings.json for details on dev-env

const nextConfig = {
  distDir: "build",
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
};

module.exports = nextConfig;
