import React from 'react'

import { useTranslation } from 'next-i18next'
import { Heading } from './media'
import { Link } from './links'
import { slug } from './slugs'

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

export const ExpeditionLinks = ({ expeditions }) => {
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
