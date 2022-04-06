import classnames from 'classnames'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './orders.module.scss'

import { Heading, Section } from './media'
import { CopyButton, InteractiveButton } from './buttons'
import { Money } from './money'
import { UserName } from './users'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

const ORDER_STATUS_CONFIRMED = 2
const ORDER_STATUS_DEPOSIT_PAID = 3

const OrderStatusMap = {
  1: 'order-status-new',
  [ORDER_STATUS_CONFIRMED]: 'order-status-confirmed',
  [ORDER_STATUS_DEPOSIT_PAID]: 'order-status-deposit-paid',
  4: 'order-status-paid',
  5: 'order-status-dispatched',
  6: 'order-status-resolved',
  7: 'order-status-cancelled',
}

const CAN_BE_PAID = [ORDER_STATUS_CONFIRMED, ORDER_STATUS_DEPOSIT_PAID]

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

const OrderRow = ({
  align = 'text-end',
  className,
  copyPasta,
  label,
  value,
  ...props
}) => (
  <div {...props} className={classnames(align, className)}>
    <span className={styles.orderRowLabel}>{label}:</span>{' '}
    <span
      className={classnames(styles.orderRowValue, {
        [styles.copyPasta]: copyPasta,
      })}
    >
      {value}
      {copyPasta && <CopyButton value={copyPasta} />}
    </span>
  </div>
)

const MoneyRow = ({ amount, label, ...props }) => (
  <OrderRow {...props} label={label} value={<Money amount={amount} />} />
)

const OrderPayDialog = ({ payAs, onHide, order, show }) => {
  const { t } = useTranslation()
  const amount = order[payAs]
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('order-pay')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('order-send-payment')}</p>
        <div className="mt-3">
          <OrderRow
            align="text-start"
            className={styles.paymentRow}
            label={t('bank-account-number')}
            value="304261154/0300"
            copyPasta="304261154/0300"
          />
          <OrderRow
            align="text-start"
            className={styles.paymentRow}
            label={t('order-variable-symbol')}
            value={order.variableSymbol}
            copyPasta={order.variableSymbol}
          />
          <MoneyRow
            align="text-start"
            className={styles.paymentRow}
            label={t('order-pay-amount')}
            amount={amount}
            copyPasta={amount}
          />
          <OrderRow
            align="text-start"
            className={styles.paymentRow}
            label={t('bank-account-iban')}
            value="CZ4303000000000304261154"
            copyPasta="CZ4303000000000304261154"
          />
          <OrderRow
            align="text-start"
            className={styles.paymentRow}
            label={t('bank-account-swift')}
            value="CEKOCZPP"
            copyPasta="CEKOCZPP"
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

const OrderPayControls = ({ order }) => {
  const [payAs, setPayAs] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const { t } = useTranslation()
  const closeDialog = () => setShowDialog(false)
  const payDeposit = () => {
    setPayAs('deposit')
    setShowDialog(true)
  }
  const paySurcharge = () => {
    setPayAs('surcharge')
    setShowDialog(true)
  }
  const payFull = () => {
    setPayAs('price')
    setShowDialog(true)
  }
  return (
    <div>
      <OrderPayDialog
        onHide={closeDialog}
        order={order}
        payAs={payAs}
        show={showDialog}
      />
      {order.useDepositPayment && order.status !== ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton
          variant="primary"
          onClick={payDeposit}
          className="me-2"
        >
          {t('order-pay-deposit')}
        </InteractiveButton>
      )}
      {order.status === ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton variant="primary" onClick={paySurcharge}>
          {t('order-pay-surcharge')}
        </InteractiveButton>
      )}
      {order.status !== ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton
          variant={order.useDepositPayment ? 'secondary' : 'primary'}
          onClick={payFull}
        >
          {t('order-pay-full')}
        </InteractiveButton>
      )}
    </div>
  )
}

const OrderControls = ({ order }) => {
  return (
    <div>
      {CAN_BE_PAID.includes(order.status) && <OrderPayControls order={order} />}
    </div>
  )
}

const OrderCard = ({ order }) => {
  const { t } = useTranslation()
  return (
    <Section component="article">
      <Heading>{order.variableSymbol}</Heading>
      <OrderItems items={order.items} />
      <Row>
        <Col className="mt-2 ms-3">
          <OrderControls order={order} />
        </Col>
        <Col className="d-flex mt-2">
          <div className="ms-auto me-3">
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
          </div>
        </Col>
      </Row>
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
