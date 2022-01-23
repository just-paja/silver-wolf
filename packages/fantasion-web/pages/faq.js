import Container from 'react-bootstrap/Container'
import React from 'react'

import { apiFetch } from '../api'
import { asPage, MetaPage } from '../components/meta'
import { Faqs } from '../components/faq'
import { GenericPage } from '../components/layout'
import { getPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'

const getFrequentlyAskedQuestions = async () => apiFetch('/faqs')

export const getServerSideProps = async (props) => {
  return {
    props: {
      faqs: await getFrequentlyAskedQuestions(),
      ...(await getPageProps(props)).props,
    },
  }
}

const Faq = ({ faqs }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage title={t('faqs-title')} description={t('faqs-description')} />
      <Container className="above-decoration mt-3">
        <Faqs faqs={faqs} />
      </Container>
    </GenericPage>
  )
}

export default asPage(Faq)
