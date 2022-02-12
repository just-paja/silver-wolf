import Container from 'react-bootstrap/Container'
import React from 'react'

import { apiFetch } from '../api'
import { asPage, MetaPage } from '../components/meta'
import { Faqs } from '../components/faq'
import { GenericPage } from '../components/layout'
import { withPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'

const getFrequentlyAskedQuestions = async () => apiFetch('/faqs')

export const getServerSideProps = withPageProps(async () => ({
  props: {
    faqs: await getFrequentlyAskedQuestions(),
  },
}))

const Faq = ({ faqs }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage title={t('faq-title')} description={t('faq-description')} />
      <Container className="above-decoration mt-3">
        <Faqs faqs={faqs} />
      </Container>
    </GenericPage>
  )
}

export default asPage(Faq)
