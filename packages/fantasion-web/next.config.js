const { i18n } = require('./next-i18next.config.js')
const { resolve } = require('path')
const { version } = require('./package.json')

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
}
