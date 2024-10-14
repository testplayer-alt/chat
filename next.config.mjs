/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: { // eslintのlint checkをbuild時にoff
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
