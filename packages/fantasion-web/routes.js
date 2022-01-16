const cs = {
  home: {
    source: '/',
    destination: '/index',
  },
  contacts: {
    source: '/kontakty',
    destination: '/contact',
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
