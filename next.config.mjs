/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },
  experimental: { cpus: 2 },
};
export default nextConfig;
