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
import {
  BillingInformation,
  PaymentInformation,
  OrderCard,
} from '../../components/orders'
import { requireUser, withPageProps } from '../../server/props'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch }) => {
    const [activeOrder, addresses] = await Promise.all([
      fetch('/orders/active'),
      fetch('/user-addresses'),
    ])
    return {
      props: {
        activeOrder,
        addresses,
      },
    }
  })
)

const PaymentAndDeliveryPage = ({ activeOrder, addresses }) => {
  const [order, setOrder] = useState(activeOrder)
  const { t } = useTranslation()
  const title = `${t('order-payment-and-delivery')}`
  return (
    <GenericPage>
      <MetaPage title={title} description={t('order-checkout-description')} />
      <Container as="article" className="mt-3">
        <Breadcrumbs
          links={[
            {
              children: t('order-payment-and-delivery'),
            },
          ]}
        />
        <header>
          <Heading>{t('order-payment-and-delivery')}</Heading>
        </header>
        <OrderCard className="mt-4" order={order} hideStatus />
        <Row>
          <Col md={6}>
            <PaymentInformation order={order} onSubmit={setOrder} />
          </Col>
          <Col md={6}>
            <BillingInformation
              addresses={addresses}
              order={order}
              onSubmit={setOrder}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-3">
          <Link
            as={InteractiveButton}
            size="lg"
            route="basket"
            variant="secondary"
          >
            {t('order-previous')}
          </Link>
          <Link
            as={InteractiveButton}
            disabled={!order.userInvoiceAddressId}
            size="lg"
            route="checkout"
          >
            {t('order-next')}
          </Link>
        </div>
      </Container>
    </GenericPage>
  )
}

export default asPage(PaymentAndDeliveryPage)