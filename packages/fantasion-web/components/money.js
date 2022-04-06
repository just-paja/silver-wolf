import classnames from 'classnames'
import styles from './money.module.scss'

import { DateLabel } from './dates'
import { useTranslation } from 'next-i18next'

const formatMoney = (locale, amount, currency) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    parseFloat(amount)
  )

export const Money = ({ amount, currency = 'CZK', ...props }) => (
  <span {...props}>
    {formatMoney(useTranslation().i18n.language, amount, currency)}
  </span>
)

const PriceTagDate = ({ direction, date }) =>
  date ? (
    <>
      {' '}
      <span className="text-muted">
        ({direction} <DateLabel date={date} />)
      </span>
    </>
  ) : null

export const PriceTag = ({
  active,
  availableSince,
  availableUntil,
  expired,
  future,
  price,
}) => {
  const { t } = useTranslation()
  console.log(price)
  return (
    <span
      className={classnames({
        [styles.expired]: expired,
      })}
    >
      <Money
        amount={price}
        className={classnames({
          [styles.active]: active,
          [styles.future]: future,
        })}
      />
      {future && <PriceTagDate direction={t('since')} date={availableSince} />}
      {(active || expired) && (
        <PriceTagDate direction={t('until')} date={availableUntil} />
      )}
    </span>
  )
}
