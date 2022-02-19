import { apiFetch } from '../api'
import { withPageProps } from './props'

export const getArticleByKey = async (articleKey) =>
  await apiFetch(`/static-articles/${articleKey}`)

export const createStaticArticlePageGetter = (articleKey) =>
  withPageProps(async () => ({
    props: {
      article: await getArticleByKey(articleKey),
    },
  }))
