import React from 'react'

import { Article } from '../../components/articles'
import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { asStatusCodePage } from '../../components/references'
import { GenericPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'

export const getExpeditionTheme = async (expeditionThemeId) => {
  try {
    return await apiFetch(`/expedition-themes/${expeditionThemeId}`)
  } catch (e) {
    if (e instanceof NotFound) {
      return null
    }
    throw e
  }
}

export const getServerSideProps = async (props) => {
  const expeditionThemeId = parseSlug(props.params.expeditionThemeSlug)
  const expeditionTheme = await getExpeditionTheme(expeditionThemeId)
  return {
    props: {
      expeditionThemeId,
      expeditionTheme,
      statusCode: expeditionTheme ? 200 : 404,
      ...(await getPageProps(props)).props,
    },
  }
}

const ExpeditionThemeDetail = ({ expeditionTheme }) => (
  <GenericPage>
    <MetaPage
      title={expeditionTheme.title}
      description={expeditionTheme.description}
    />
    <Article
      media={expeditionTheme.media}
      description={expeditionTheme.description}
      text={expeditionTheme.detailedDescription}
      title={expeditionTheme.title}
    />
  </GenericPage>
)

export default asPage(asStatusCodePage(ExpeditionThemeDetail))
