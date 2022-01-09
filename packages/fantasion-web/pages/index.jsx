import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { GeneralNewsletterForm } from '../components/GeneralNewsletterForm'
import { getPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'

export const getStaticProps = getPageProps

const Home = () => {
  const { t } = useTranslation()
  return (
    <main>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <Container>
        <h1>{t('fantasion-title')}</h1>
        <p>{t('fantasion-general-description')}</p>
        <GeneralNewsletterForm />
      </Container>
    </main>
  )
}

export default asPage(Home)
