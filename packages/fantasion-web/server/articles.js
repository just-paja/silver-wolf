import { withPageProps } from './props'

export const getArticleByKey = async (fetch, articleKey) =>
  await fetch(`/static-articles/${articleKey}`)

export const createStaticArticlePageGetter = (articleKey) =>
  withPageProps(async ({ fetch }) => ({
    props: {
      article: await getArticleByKey(fetch, articleKey),
    },
  }))
