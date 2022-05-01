import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { OrderList } from '../components/orders/OrderList'
import { ProfileLayout } from '../components/family/ProfileLayout'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { requireUser, withPageProps } from '../server/props'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch }) => {
    const defaultOrders = await fetch('/orders')
    return { props: { defaultOrders } }
  })
)

const Status = ({ defaultOrders }) => {
  const [orders, setOrders] = useState(defaultOrders)
  const { t } = useTranslation()
  const onOrderCancel = (order) => {
    setOrders({
      ...orders,
      results: orders.results.map((o) => (o.id === order.id ? order : o)),
    })
  }
  return (
    <GenericPage>
      <MetaPage
        title={t('fantasion-title')}
        description={t('fantasion-general-description')}
      />
      <ProfileLayout>
        <Heading>{t('orders')}</Heading>
        <OrderList orders={orders} onOrderCancel={onOrderCancel} />
      </ProfileLayout>
    </GenericPage>
  )
}

export default asPage(Status)
