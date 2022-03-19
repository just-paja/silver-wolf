const { defaultLang, getRewrites } = require('./routes')
const { i18n } = require('./next-i18next.config.js')
const { resolve } = require('path')
const { version } = require('./package.json')

const baseDomain = process.env.FRONTEND_HOST || 'fantasion.cz'
const apiUrl = process.env.API_URL || 'http://localhost:8000/api/v1'
const typoDomains = ['fantazion.cz', 'www.fantazion.cz', 'www.fantasion.cz']
const oneYear = 31536000
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: `max-age=${oneYear}; includeSubdomains; preload`,
  },
]

module.exports = {
  assetPrefix: process.env.STATIC_ROOT
    ? `${process.env.STATIC_ROOT}/web/${version}`
    : '',
  reactStrictMode: true,
  i18n,
  trailingSlash: true,
  sassOptions: {
    includePaths: [resolve(__dirname, '..', '..')],
  },
  publicRuntimeConfig: {
    apiUrl,
    baseDomain,
    defaultLang,
  },
  images: {
    domains: [
      'localhost',
      process.env.STATIC_ROOT
        ? new URL(process.env.STATIC_ROOT).hostname
        : null,
    ].filter(Boolean),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: `(${typoDomains.join('|')})`,
          },
        ],
        destination: `https://${baseDomain}/:path*`,
      },
    ]
  },
  async rewrites() {
    return getRewrites()
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.jsx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}
