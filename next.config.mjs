/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/branches', destination: '/cargo/branches', permanent: true },
      { source: '/customers', destination: '/cargo/customers', permanent: true },
      { source: '/finance', destination: '/cargo/finance', permanent: true },
      { source: '/gallery', destination: '/test/gallery', permanent: true },
      { source: '/reports', destination: '/cargo/reports', permanent: true },
      { source: '/settings', destination: '/cargo/settings', permanent: true },
      { source: '/shipments', destination: '/cargo/shipments', permanent: true },
      { source: '/shipments/new', destination: '/cargo/shipments/new', permanent: true },
      { source: '/shipments/track', destination: '/cargo/shipments/track', permanent: true },
      { source: '/shipments/:path*', destination: '/cargo/shipments/:path*', permanent: true },
    ]
  },
}

export default nextConfig
