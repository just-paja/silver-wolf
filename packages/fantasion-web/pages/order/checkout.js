import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../../components/meta'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { Link } from '../../components/links'
import { InteractiveButton } from '../../components/buttons'
import { requireUser, withPageProps } from '../../server/props'
import { reverse } from '../../routes'
import { useFetch, useLang } from '../../components/context'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { BillingInformationPreview, OrderCard } from '../../components/orders'

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

const OrderCheckoutPage = ({ activeOrder }) => {
  const [order, setOrder] = useState(activeOrder)
  const { t } = useTranslation()
  const fetch = useFetch()
  const title = `${t('order-checkout')}`
  const router = useRouter()
  const lang = useLang()
  const confirmOrder = async () => {
    setOrder(await fetch.put(`/orders/${order.id}/confirm`))
    router.push(reverse(lang, 'status'))
  }
  return (
    <GenericPage>
      <MetaPage title={title} description={t('order-checkout-description')} />
      <Container as="article" className="mt-3">
        <Breadcrumbs
          links={[
            {
              children: t('order-checkout'),
            },
          ]}
        />
        <header>
          <Heading>{t('order-payment-and-delivery')}</Heading>
        </header>
        <OrderCard className="mt-4" order={order} hideStatus />
        <Row>
          <Col md={6}>
            <BillingInformationPreview order={order} />
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-3">
          <Link
            as={InteractiveButton}
            size="lg"
            route="paymentAndDelivery"
            variant="secondary"
          >
            {t('order-previous')}
          </Link>
          <InteractiveButton size="lg" onClick={confirmOrder}>
            {t('order-confirm')}
          </InteractiveButton>
        </div>
      </Container>
    </GenericPage>
  )
}

export default asPage(OrderCheckoutPage)
