import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../../components/meta'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { requireUser, withPageProps } from '../../server/props'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { OrderCard } from '../../components/orders'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch, params }) => {
    const [defaultOrder] = await Promise.all([
      fetch(`/orders/${params.orderId}`),
    ])
    return {
      props: {
        defaultOrder,
      },
    }
  })
)

const OrderDetailPage = ({ defaultOrder }) => {
  const [order] = useState(defaultOrder)
  const { t } = useTranslation()
  const title = t('order-id-title', { orderNumber: order.variableSymbol })
  return (
    <GenericPage>
      <MetaPage title={title} description={t('order-checkout-description')} />
      <Container as="article" className="mt-3">
        <Row>
          <Col lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
            <Breadcrumbs
              links={[
                {
                  children: t('my-status'),
                  route: 'status',
                },
                {
                  children: title,
                },
              ]}
            />
            <header>
              <Heading>{title}</Heading>
            </header>
            <OrderCard order={order} />
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(OrderDetailPage)
