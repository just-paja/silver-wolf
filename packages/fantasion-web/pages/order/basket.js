import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { OrderCard, PromotionCodeForm } from '../../components/orders'
import { Heading } from '../../components/media'
import { useTranslation } from 'next-i18next'
import { requireUser, withPageProps } from '../../server/props'
import { useState } from 'react'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch }) => {
    const [activeOrder] = await Promise.all([fetch('/orders/active')])
    return {
      props: {
        activeOrder,
      },
    }
  })
)

const BasketPage = ({ activeOrder }) => {
  const [order, setOrder] = useState(activeOrder)
  const { t } = useTranslation()
  const title = `${t('order-basket')}`
  return (
    <GenericPage>
      <MetaPage title={title} description={t('order-checkout-description')} />
      <Container as="article" className="mt-3">
        <Breadcrumbs
          links={[
            {
              children: t('order-basket'),
            },
          ]}
        />
        <header>
          <Heading>{t('order-basket')}</Heading>
        </header>
        <OrderCard className="mt-4" defaultOrder={order} hideStatus />
        <PromotionCodeForm order={order} onSubmit={setOrder} />
      </Container>
    </GenericPage>
  )
}

export default asPage(BasketPage)
