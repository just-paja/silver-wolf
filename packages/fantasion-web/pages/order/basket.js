import Container from 'react-bootstrap/Container'
import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { Link } from '../../components/links'
import { InteractiveButton } from '../../components/buttons'
import { OrderCard, PromotionCodeForm } from '../../components/orders'
import { requireUser, withPageProps } from '../../server/props'
import { useFetch } from '../../components/context'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

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
  const fetch = useFetch()
  const { t } = useTranslation()
  const title = `${t('order-basket')}`
  const deleteItem = async (item) => {
    setOrder(await fetch.delete(`/order-items/${item.id}`))
  }
  const hasPromotionCode = Boolean(
    order?.items?.some(
      (item) => item.productType === 'fantasion_eshop.OrderPromotionCode'
    )
  )
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
        <OrderCard
          className="mt-4"
          order={order}
          hideStatus
          onItemDelete={deleteItem}
        />
        <div className="d-flex justify-content-end mt-3">
          <Link as={InteractiveButton} size="lg" route="paymentAndDelivery">
            {t('order-next')}
          </Link>
        </div>
        {!hasPromotionCode && (
          <PromotionCodeForm order={order} onSubmit={setOrder} />
        )}
      </Container>
    </GenericPage>
  )
}

export default asPage(BasketPage)