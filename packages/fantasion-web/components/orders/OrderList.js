import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import { DateLabel } from '../dates'
import { Link } from '../links'
import { Money } from '../money'
import { OrderItemIcons } from './OrderItem'
import { OrderStatus } from './OrderStatus'
import { Section } from '../media'
import { useTranslation } from 'next-i18next'

const OrderListRow = ({ order, ...props }) => (
  <ListGroup.Item {...props}>
    <Row>
      <Col xs={6} sm={8} md={10}>
        <Row>
          <Col sm={6} md={4}>
            <Row>
              <Col xs={12} lg={6}>
                <Link route="orderDetail" params={{ orderId: order.id }}>
                  <strong>{order.variableSymbol}</strong>
                </Link>
              </Col>
              <Col xs={12} lg={6}>
                <DateLabel date={order.submittedAt} />
              </Col>
            </Row>
          </Col>
          <Col sm={6} md={8}>
            <Row>
              <Col xs={12} lg={6}>
                <Money amount={order.price} />
              </Col>
              <Col xs={12} lg={6}>
                <OrderStatus status={order.status} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col xs={6} sm={4} md={2} className="d-flex justify-content-end">
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
