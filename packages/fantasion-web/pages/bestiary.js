import Container from 'react-bootstrap/Container'
import React from 'react'

import { ArticleBody } from '../components/articles'
import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { MonsterList } from '../components/monsters'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

export const getServerSideProps = withPageProps(async ({ fetch }) => ({
  props: {
    monsters: await fetch('/monsters'),
  },
}))

const BestiaryPage = ({ monsters }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage title={t('bestiary')} description={t('bestiary-description')} />
      <Container>
        <Heading>{t('bestiary')}</Heading>
        <ArticleBody text={t('bestiary-description')} />
        <MonsterList monsters={monsters.results} />
      </Container>
    </GenericPage>
  )
}

export default asPage(BestiaryPage)
