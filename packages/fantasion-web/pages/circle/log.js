import React from 'react'

import { DateLabel } from '../../components/dates'
import { asPage, MetaPage } from '../../components/meta'
import { Article } from '../../components/articles'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { ProfileLayout } from '../../components/family/ProfileLayout'
import { requireUser, withPageProps } from '../../server/props'
import { useTranslation } from 'next-i18next'
import { withEntityCollection } from '../../components/entities'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch }) => {
    const articles = await fetch('/expedition-log-articles')
    return { props: { articles } }
  })
)

const LogPage = ({ articles }) => {
  const { t } = useTranslation()
  const title = t('circle-log')
  return (
    <GenericPage>
      <MetaPage title={title} description={t('circle-log-description')} />
      <ProfileLayout>
        <Breadcrumbs
          links={[
            {
              children: t('my-status'),
              route: 'status',
            },
            {
              children: title,
            },
          ]}
        />
        <Heading>{title}</Heading>
        {articles.results.map((article) => (
          <Article
            {...article}
            className="mt-3"
            key={article.id}
            subTitle={<DateLabel date={article.date} />}
          />
        ))}
      </ProfileLayout>
    </GenericPage>
  )
}

export default asPage(withEntityCollection(LogPage, 'expedition-log-articles'))
