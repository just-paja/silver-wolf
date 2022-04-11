import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import { DateLabel } from '../dates'
import { Money } from '../money'
import { OrderItemIcons } from './OrderItem'
import { OrderStatus } from './OrderStatus'
import { Section } from '../media'
import { useTranslation } from 'next-i18next'

const OrderListRow = ({ order, ...props }) => (
  <ListGroup.Item {...props}>
    <Row>
      <Col md={3}>
        <Row>
          <Col xs={12} lg={6}>
            <strong>{order.variableSymbol}</strong>
          </Col>
          <Col xs={12} lg={6}>
            <DateLabel date={order.submittedAt} />
          </Col>
        </Row>
      </Col>
      <Col md={6}>
        <Row>
          <Col xs={12} lg={6}>
            <Money amount={order.price} />
          </Col>
          <Col xs={12} lg={6}>
            <OrderStatus status={order.status} />
          </Col>
        </Row>
      </Col>
      <Col md={3}>
        <OrderItemIcons items={order.items} />
      </Col>
    </Row>
  </ListGroup.Item>
)

const OrderListEmpty = () => (
  <div className="text-muted mt-3">
    <p>{useTranslation().t('order-list-empty')}</p>
  </div>
)

export const OrderList = ({ orders, onOrderCancel }) => (
  <Section className="mt-3">
    {orders.results.length === 0 ? (
      <OrderListEmpty />
    ) : (
      orders.results.map((order) => (
        <OrderListRow key={order.id} order={order} onCancel={onOrderCancel} />
      ))
    )}
  </Section>
)
