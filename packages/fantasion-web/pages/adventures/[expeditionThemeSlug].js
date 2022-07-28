import Container from 'react-bootstrap/Container'
import React from 'react'

import { Article } from '../../components/articles'
import { asPage, MetaPage } from '../../components/meta'
import { GenericPage } from '../../components/layout'
import { parseSlug } from '../../components/slugs'
import { withPageProps } from '../../server/props'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => {
  const expeditionThemeId = parseSlug(params.expeditionThemeSlug)
  const expeditionTheme = await fetch(`/expedition-themes/${expeditionThemeId}`)
  return {
    props: {
      expeditionThemeId,
      expeditionTheme,
    },
  }
})

const ExpeditionThemeDetail = ({ expeditionTheme }) => (
  <GenericPage>
    <MetaPage
      title={expeditionTheme.title}
      description={expeditionTheme.description}
    />
    <Container>
      <Article
        media={expeditionTheme.media}
        description={expeditionTheme.description}
        text={expeditionTheme.detailedDescription}
        title={expeditionTheme.title}
      />
    </Container>
  </GenericPage>
)

export default asPage(ExpeditionThemeDetail)
