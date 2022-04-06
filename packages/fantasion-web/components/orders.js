import ListGroup from 'react-bootstrap/ListGroup'
import styles from './orders.module.scss'

import { Heading, Section } from './media'
import { Money } from './money'
import { UserName } from './users'
import { useTranslation } from 'next-i18next'

const OrderStatusMap = {
  1: 'order-status-new',
  2: 'order-status-confirmed',
  3: 'order-status-deposit-paid',
  4: 'order-status-paid',
  5: 'order-status-dispatched',
  6: 'order-status-resolved',
  7: 'order-status-cancelled',
}

const OrderStatus = ({ status }) => useTranslation().t(OrderStatusMap[status])

const OrderItemPromotionCode = () => useTranslation().t('order-promotion-code')

const OrderItemSignup = ({ signup }) => {
  return (
    <>
      <UserName user={signup.participant} />
      <div className={styles.troopDescription}>
        {signup.troop.batch.expedition.title}: {signup.troop.ageGroup.title}
      </div>
    </>
  )
}

const OrderItemDescription = ({ item }) => {
  if (item.productType === 'fantasion_signups.Signup') {
    return <OrderItemSignup signup={item} />
  }
  if (item.productType === 'fantasion_eshop.OrderPromotionCode') {
    return <OrderItemPromotionCode code={item} />
  }
  return item.description
}

const OrderItem = ({ item }) => {
  return (
    <ListGroup.Item className="d-flex">
      <div className="flex-grow-1">
        <OrderItemDescription item={item} />
      </div>
      <div className="text-end">
        <Money amount={item.price} />
      </div>
    </ListGroup.Item>
  )
}

const OrderItems = ({ items }) => {
  return (
    <ListGroup className="mt-2">
      {items.map((item) => (
        <OrderItem item={item} key={item.id} />
      ))}
    </ListGroup>
  )
}

const OrderRow = ({ label, value }) => (
  <div className="text-end">
    <span>{label}</span>
    {': '}
    {value}
  </div>
)

const MoneyRow = ({ label, amount }) => (
  <OrderRow label={label} value={<Money amount={amount} />} />
)

const OrderCard = ({ order }) => {
  const { t } = useTranslation()
  return (
    <Section component="article">
      <Heading>{order.variableSymbol}</Heading>
      <OrderItems items={order.items} />
      <div className="d-flex">
        <p className="mt-2 ms-auto me-3">
          {order.useDepositPayment && (
            <>
              <MoneyRow label={t('order-deposit')} amount={order.deposit} />
              <MoneyRow
                label={t('order-surcharge')}
                amount={order.price - order.deposit}
              />
            </>
          )}
          <MoneyRow label={t('order-total')} amount={order.price} />
          <OrderRow
            label={t('order-status')}
            value={<OrderStatus status={order.status} />}
          />
        </p>
      </div>
    </Section>
  )
}

export const OrderList = ({ orders }) => {
  const { t } = useTranslation()
  return (
    <Section headingLevel={0}>
      <Heading>{t('orders')}</Heading>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </Section>
  )
}
