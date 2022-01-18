import Container from 'react-bootstrap/Container'
import Error from 'next/error'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { SiteNavbar } from '../components/layout'
import { useTranslation } from 'next-i18next'

export const StaticArticlePage = asPage(({ article, statusCode }) => {
  const { t } = useTranslation()
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />
  }
  return (
    <main>
      <MetaPage
        title={article.title}
        description={t('fantasion-general-description')}
      />
      <SiteNavbar />
      <Container>
        <h1>{article.title}</h1>
      </Container>
    </main>
  )
})
