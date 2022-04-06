import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { OrderList } from '../components/orders'
import { useTranslation } from 'next-i18next'
import { requireUser, withPageProps } from '../server/props'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch }) => {
    const orders = await fetch('/orders/')
    return { props: { orders } }
  })
)

const Status = ({ orders }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <Container>
        <OrderList orders={orders} />
      </Container>
    </GenericPage>
  )
}

export default asPage(Status)
