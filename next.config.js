/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  typescript: {
    // Re-enabled: errors must be fixed, not hidden
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['pos.vendty.com', 'vendty-img-new.s3.us-east-2.amazonaws.com', 'vendty.com'],
  },
}

module.exports = nextConfig
