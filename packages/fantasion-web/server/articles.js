import { apiFetch, NotFound } from '../api'
import { getPageProps } from './props'

const getArticleByKey = async (articleKey) => {
  try {
    return await apiFetch(`/static-articles/${articleKey}`)
  } catch (e) {
    if (e instanceof NotFound) {
      return null
    }
    throw e
  }
}

export const createStaticArticlePageGetter = (articleKey) => async (props) => {
  const defaults = await getPageProps(props)
  const article = await getArticleByKey(articleKey)
  return {
    props: {
      statusCode: article ? 200 : 404,
      ...defaults.props,
      article,
    },
  }
}
