import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { getPageProps } from '../server/props'
import { LoginForm } from '../components/login'
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
        title={t('login-title')}
        description={t('login-general-description')}
      />
      <Container>
        <h1>{t('login-with-email')}</h1>
        <LoginForm />
      </Container>
    </GenericPage>
  )
}

export default asPage(Contacts)
