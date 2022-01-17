import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { ContactCard } from '../components/ContactCard'
import { getPageProps } from '../server/props'
import { SiteNavbar } from '../components/layout'
import { useTranslation } from 'next-i18next'

export const getServerSideProps = async (props) => {
  return {
    props: {
      ...(await getPageProps(props)).props,
    },
  }
}

const Contacts = () => {
  const { t } = useTranslation()
  return (
    <main>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <SiteNavbar />
      <Container>
        <h1>{t('contacts-title')}</h1>
        <ContactCard />
      </Container>
    </main>
  )
}

export default asPage(Contacts)
