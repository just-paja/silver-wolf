import Container from 'react-bootstrap/Container'
import React from 'react'

import { apiFetch } from '../api'
import { asPage, MetaPage } from '../components/meta'
import { ExpeditionList } from '../components/ExpeditionList'
import { GeneralNewsletterForm } from '../components/GeneralNewsletterForm'
import { GenericPage } from '../components/layout'
import { getPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'
import { HomeFlavour } from '../components/home'

const getExpeditions = async () => apiFetch('/expeditions')

const getFlavourTexts = async () => apiFetch('/flavour-texts')

export const getServerSideProps = async (props) => {
  return {
    props: {
      expeditions: await getExpeditions(),
      flavourTexts: await getFlavourTexts(),
      ...(await getPageProps(props)).props,
    },
  }
}

const Home = ({ expeditions, flavourTexts }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <HomeFlavour flavourTexts={flavourTexts.results} />
      <ExpeditionList expeditions={expeditions} />
      <Container className="above-decoration">
        <GeneralNewsletterForm className="mt-3" />
      </Container>
    </GenericPage>
  )
}

export default asPage(Home)
