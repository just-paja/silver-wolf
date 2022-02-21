import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { ExpeditionList } from '../components/ExpeditionList'
import { GenericPage } from '../components/layout'
import { getArticleByKey } from '../server/articles'
import { withPageProps } from '../server/props'
import { HomeAbout, HomeFlavour } from '../components/home'
import { useTranslation } from 'next-i18next'

import styles from './index.module.scss'

export const getServerSideProps = withPageProps(async ({ fetch }) => ({
  props: {
    aboutUs: await getArticleByKey(fetch, 'about-us'),
    expeditions: await fetch('/expeditions'),
    flavourTexts: await fetch('/flavour-texts'),
  },
}))

const Home = ({ aboutUs, expeditions, flavourTexts }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <HomeFlavour flavourTexts={flavourTexts.results} />
      <ExpeditionList
        className={styles.expeditionList}
        expeditions={expeditions}
      />
      {aboutUs ? (
        <Container className="above-decoration mt-3">
          <HomeAbout article={aboutUs} />
        </Container>
      ) : null}
    </GenericPage>
  )
}

export default asPage(Home)
