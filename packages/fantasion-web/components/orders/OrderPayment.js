import Carousel from 'react-bootstrap/Carousel'
import classnames from 'classnames'
import Modal from 'react-bootstrap/Modal'
import styles from './OrderPayment.module.scss'

import { CopyButton, InteractiveButton } from '../buttons'
import { useUser } from '../context'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ORDER_STATUS_DEPOSIT_PAID, CAN_BE_PAID } from './OrderStatus'

import {
  Money,
  PaymentQrCode,
  ACCOUNT_BIC,
  ACCOUNT_IBAN,
  ACCOUNT_NUMBER,
  DEFAULT_CURRENCY,
} from '../money'

export const OrderPaymentRow = ({
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

export const OrderMoneyRow = ({ amount, label, ...props }) => (
  <OrderPaymentRow {...props} label={label} value={<Money amount={amount} />} />
)

const OrderPayDialog = ({ payAs, onHide, order, show }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()
  const user = useUser()
  const markAsPaid = () => setActiveIndex(1)
  const amount =
    payAs == 'surcharge' ? order.price - order.deposit : order[payAs]
  return (
    <Modal show={show} onHide={onHide} onExited={() => setActiveIndex(0)}>
      <Modal.Header closeButton>
        <Modal.Title>{t('order-pay')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel
          activeIndex={activeIndex}
          indicators={false}
          touch={false}
          wrap={false}
          controls={false}
        >
          <Carousel.Item>
            <p>{t('order-send-payment')}</p>
            <div className="mt-3">
              <OrderPaymentRow
                align="text-start"
                className={styles.paymentRow}
                label={t('bank-account-number')}
                value={ACCOUNT_NUMBER}
                copyPasta={ACCOUNT_NUMBER}
              />
              <OrderPaymentRow
                align="text-start"
                className={styles.paymentRow}
                label={t('order-variable-symbol')}
                value={order.variableSymbol}
                copyPasta={order.variableSymbol}
              />
              <OrderMoneyRow
                align="text-start"
                className={styles.paymentRow}
                label={t('order-pay-amount')}
                amount={amount}
                copyPasta={amount}
              />
              <OrderPaymentRow
                align="text-start"
                className={styles.paymentRow}
                label={t('bank-account-iban')}
                value={ACCOUNT_IBAN}
                copyPasta={ACCOUNT_IBAN}
              />
              <OrderPaymentRow
                align="text-start"
                className={styles.paymentRow}
                label={t('bank-account-bic')}
                value={ACCOUNT_BIC}
                copyPasta={ACCOUNT_BIC}
              />
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <PaymentQrCode
                amount={amount}
                bic={ACCOUNT_BIC}
                currency={DEFAULT_CURRENCY}
                message={user.email}
                iban={ACCOUNT_IBAN}
                variableSymbol={order.variableSymbol}
              />
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <InteractiveButton variant="primary" onClick={markAsPaid}>
                {t('order-already-paid')}
              </InteractiveButton>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <p className="fs-3">{t('that-is-great')}</p>
            <p>{t('order-wait-after-payment')}</p>
            <div className="mt-3">
              <InteractiveButton variant="primary" onClick={onHide}>
                {t('that-is-really-awesome')}
              </InteractiveButton>
            </div>
          </Carousel.Item>
        </Carousel>
      </Modal.Body>
    </Modal>
  )
}

const OrderPaymentButtons = ({ order }) => {
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
    <>
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
          className="m-2"
        >
          {t('order-pay-deposit')}
        </InteractiveButton>
      )}
      {order.status === ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton
          variant="primary"
          onClick={paySurcharge}
          className="m-2"
        >
          {t('order-pay-surcharge')}
        </InteractiveButton>
      )}
      {order.status !== ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton
          className="m-2"
          variant={order.useDepositPayment ? 'secondary' : 'primary'}
          onClick={payFull}
        >
          {t('order-pay-full')}
        </InteractiveButton>
      )}
    </>
  )
}

export const OrderPaymentControls = ({ order, ...props }) =>
  CAN_BE_PAID.includes(order.status) && (
    <OrderPaymentButtons order={order} {...props} />
  )
