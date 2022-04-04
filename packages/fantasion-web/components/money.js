import classnames from 'classnames'
import styles from './money.module.scss'

import { DateLabel } from './dates'
import { useTranslation } from 'next-i18next'

const currencyMap = {
  CZK: (amount) => `${amount}\u00A0Kč`,
}

const formatMoney = (amount, currency) =>
  currencyMap[currency](parseFloat(amount))

const Money = ({ amount, currency = 'CZK', ...props }) => (
  <span {...props}>{formatMoney(amount, currency)}</span>
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
