/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
}
export default nextConfig
