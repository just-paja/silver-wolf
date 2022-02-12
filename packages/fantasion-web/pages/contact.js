import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../components/meta'
import { ContactCard } from '../components/ContactCard'
import { GenericPage } from '../components/layout'
import { GeneralNewsletterForm } from '../components/GeneralNewsletterForm'
import { withPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'

export const getServerSideProps = withPageProps()

const Contacts = () => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <Container>
        <Row>
          <Col md={6}>
            <h1>{t('contacts-title')}</h1>
            <ContactCard />
          </Col>
          <Col md={6}>
            <GeneralNewsletterForm className="mt-3" />
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(Contacts)
