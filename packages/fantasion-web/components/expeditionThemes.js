import React from 'react'

import { Article } from './articles'
import { Heading } from './media'
import { slug } from './slugs'
import { Link } from './links'
import { useTranslation } from 'next-i18next'

const ExpeditionLink = ({ expedition }) => (
  <li>
    <Link
      route="expeditionDetail"
      params={{ expeditionSlug: slug(expedition) }}
    >
      {expedition.title}
    </Link>
  </li>
)

const ExpeditionLinks = ({ expeditions }) => {
  const { t } = useTranslation()
  return (
    <section className="mt-3">
      <Heading>{t('adventure-expeditions-title')}</Heading>
      <ul>
        {expeditions.map((expedition) => (
          <ExpeditionLink key={expedition.id} expedition={expedition} />
        ))}
      </ul>
    </section>
  )
}

const ExpeditionThemeArticle = ({ theme }) => {
  return (
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
  )
}

export const ExpeditionThemeList = ({ expeditionThemes }) =>
  expeditionThemes.map((expeditionTheme) => (
    <ExpeditionThemeArticle key={expeditionTheme.id} theme={expeditionTheme} />
  ))
