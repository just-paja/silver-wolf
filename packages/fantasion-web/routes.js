const cs = {
  about: {
    source: '/o-nas',
    destination: '/about',
  },
  contacts: {
    source: '/kontakty',
    destination: '/contact',
  },
  home: {
    source: '/',
    destination: '/index',
  },
  privacyPolicy: {
    source: '/zasady-ochrany-osobnich-udaju',
    destination: '/privacy-policy',
  },
}

const routes = {
  cs,
}

const getRewrites = () =>
  Object.entries(routes).reduce(
    (aggr, [, paths]) => [...aggr, ...Object.values(paths)],
    []
  )

const reverse = (lang, name) => `/${lang}${routes[lang][name].source}`

module.exports = { getRewrites, reverse }
