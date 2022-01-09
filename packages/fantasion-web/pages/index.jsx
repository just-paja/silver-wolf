import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { ExpeditionList } from '../components/ExpeditionList'
import { GeneralNewsletterForm } from '../components/GeneralNewsletterForm'
import { getPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'
import { apiFetch } from '../api'

const getExpeditions = async () => apiFetch('/expeditions')

export const getServerSideProps = async (props) => {
  return {
    props: {
      expeditions: await getExpeditions(),
      ...(await getPageProps(props)).props,
    },
  }
}

const Home = ({ expeditions }) => {
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
        <ExpeditionList expeditions={expeditions} />
        <GeneralNewsletterForm />
      </Container>
    </main>
  )
}

export default asPage(Home)
