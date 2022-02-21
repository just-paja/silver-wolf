import Container from 'react-bootstrap/Container'
import React from 'react'

import { ArticleBody } from '../components/articles'
import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { ProfileList } from '../components/profiles'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

export const getServerSideProps = withPageProps(async ({ fetch }) => ({
  props: {
    profiles: await fetch('/profiles'),
  },
}))

const TeamPage = ({ profiles }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('our-team')}
        description={t('our-team-general-description')}
      />
      <Container>
        <Heading>{t('our-team')}</Heading>
        <ArticleBody text={t('our-team-general-description')} />
        <ProfileList profiles={profiles.results} />
      </Container>
    </GenericPage>
  )
}

export default asPage(TeamPage)
