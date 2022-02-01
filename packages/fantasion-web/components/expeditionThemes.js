import React from 'react'

import { Article } from './articles'

const ExpeditionThemeArticle = ({ theme }) => (
  <Article
    description={theme.description}
    media={theme.media}
    text={theme.detailedDescription}
    title={theme.title}
  />
)

export const ExpeditionThemeList = ({ expeditionThemes }) =>
  expeditionThemes.map((expeditionTheme) => (
    <ExpeditionThemeArticle key={expeditionTheme.id} theme={expeditionTheme} />
  ))
