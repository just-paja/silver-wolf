import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { ContactCard } from '../components/ContactCard'
import { GenericPage } from '../components/layout'
import { getPageProps } from '../server/props'
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
    <GenericPage>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <Container>
        <h1>{t('contacts-title')}</h1>
        <ContactCard />
      </Container>
    </GenericPage>
  )
}

export default asPage(Contacts)
