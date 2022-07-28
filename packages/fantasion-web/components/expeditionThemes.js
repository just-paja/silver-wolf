import Container from 'react-bootstrap/Container'
import React from 'react'

import { Article } from './articles'
import { ExpeditionLinks } from './expeditionLinks'
import { slug } from './slugs'

const ExpeditionThemeArticle = ({ theme }) => {
  return (
    <Container>
      <Article
        description={theme.description}
        media={theme.media}
        text={theme.detailedDescription}
        selfLink={{
          route: 'adventureDetail',
          params: { expeditionThemeSlug: slug(theme) },
        }}
        afterText={
          theme.expeditions.length === 0 ? null : (
            <ExpeditionLinks expeditions={theme.expeditions} />
          )
        }
        title={theme.title}
      />
    </Container>
  )
}

export const ExpeditionThemeList = ({ expeditionThemes }) =>
  expeditionThemes.map((expeditionTheme) => (
    <ExpeditionThemeArticle key={expeditionTheme.id} theme={expeditionTheme} />
  ))
