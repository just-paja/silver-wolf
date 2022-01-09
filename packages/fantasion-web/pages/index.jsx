import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { ExpeditionList } from '../components/ExpeditionList'
import { GeneralNewsletterForm } from '../components/GeneralNewsletterForm'
import { getPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'

import fetch from 'cross-fetch'

const apiUrl = process.env.API_URL || 'http://localhost:8000/api/v1'

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${apiUrl}${path}`, options)
  return await res.json()
}

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
