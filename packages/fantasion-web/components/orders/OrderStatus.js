import { useTranslation } from 'next-i18next'

export const ORDER_STATUS_NEW = 1
export const ORDER_STATUS_CONFIRMED = 2
export const ORDER_STATUS_DEPOSIT_PAID = 3
export const ORDER_STATUS_PAID = 4
export const ORDER_STATUS_DISPATCHED = 5
export const ORDER_STATUS_RESOLVED = 6
export const ORDER_STATUS_CANCELLED = 7

export const CAN_BE_PAID = [ORDER_STATUS_CONFIRMED, ORDER_STATUS_DEPOSIT_PAID]

const OrderStatusMap = {
  [ORDER_STATUS_NEW]: 'order-status-new',
  [ORDER_STATUS_CONFIRMED]: 'order-status-confirmed',
  [ORDER_STATUS_DEPOSIT_PAID]: 'order-status-deposit-paid',
  [ORDER_STATUS_PAID]: 'order-status-paid',
  [ORDER_STATUS_DISPATCHED]: 'order-status-dispatched',
  [ORDER_STATUS_RESOLVED]: 'order-status-resolved',
  [ORDER_STATUS_CANCELLED]: 'order-status-cancelled',
}

export const OrderStatus = ({ status }) =>
  useTranslation().t(OrderStatusMap[status])
