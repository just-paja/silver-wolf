const { defaultLang, getRewrites } = require('./routes')
const { i18n } = require('./next-i18next.config.js')
const { resolve } = require('path')
const { version } = require('./package.json')

const baseDomain = process.env.FRONTEND_HOST || 'fantasion.cz'
const typoDomains = ['fantazion.cz', 'www.fantazion.cz', 'www.fantasion.cz']

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
