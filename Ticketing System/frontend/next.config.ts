import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React StrictMode double-invokes renders in dev mode. With Next.js 15 +
  // React 19 this can cause OuterLayoutRouter to run before LayoutRouterContext
  // is ready (E56 invariant). Disable until upstream fix lands.
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig
