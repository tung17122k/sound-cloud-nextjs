/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'host.docker.internal',
        port: '8001',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
