/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/site' : '',
  assetPrefix: isProd ? '/site/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
