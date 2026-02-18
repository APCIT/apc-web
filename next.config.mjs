/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
}
export default nextConfig
