import Container from 'react-bootstrap/Container'
import React from 'react'

import { apiFetch } from '../api'
import { asPage, MetaPage } from '../components/meta'
import { ExpeditionList } from '../components/ExpeditionList'
import { GenericPage } from '../components/layout'
import { getArticleByKey } from '../server/articles'
import { getPageProps } from '../server/props'
import { HomeAbout, HomeFlavour } from '../components/home'
import { useTranslation } from 'next-i18next'

const getExpeditions = async () => apiFetch('/expeditions')

const getFlavourTexts = async () => apiFetch('/flavour-texts')

export const getServerSideProps = async (props) => {
  return {
    props: {
      aboutUs: await getArticleByKey('about-us'),
      expeditions: await getExpeditions(),
      flavourTexts: await getFlavourTexts(),
      ...(await getPageProps(props)).props,
    },
  }
}

const Home = ({ aboutUs, expeditions, flavourTexts }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <HomeFlavour flavourTexts={flavourTexts.results} />
      <ExpeditionList expeditions={expeditions} />
      <Container className="above-decoration mt-3">
        <HomeAbout article={aboutUs} />
      </Container>
    </GenericPage>
  )
}

export default asPage(Home)
