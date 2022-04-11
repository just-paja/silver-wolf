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
    const [activeOrder, userAddresses] = await Promise.all([
      fetch('/orders/active'),
      fetch('/user-addresses'),
    ])
    return {
      props: {
        activeOrder,
        userAddresses,
      },
    }
  })
)

const PaymentAndDeliveryPage = ({ activeOrder, userAddresses }) => {
  const [order, setOrder] = useState(activeOrder)
  const [addresses, setAddresses] = useState(userAddresses)
  const { t } = useTranslation()
  const title = `${t('order-payment-and-delivery')}`
  const handleAddAddress = (address) => {
    setAddresses({
      ...addresses,
      results: [...addresses.results, address],
    })
  }
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
        <Row>
          <Col md={6}>
            <PaymentInformation order={order} onSubmit={setOrder} />
            <BillingInformation
              addresses={addresses}
              order={order}
              onSubmit={setOrder}
              onAddAddress={handleAddAddress}
            />
          </Col>
          <Col md={6}>
            <OrderCard className="mt-4" order={order} hideStatus />
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
