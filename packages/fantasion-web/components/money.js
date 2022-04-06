import classnames from 'classnames'
import QrCode from 'react-qr-code'
import styles from './money.module.scss'

import { DateLabel } from './dates'
import { useTranslation } from 'next-i18next'

export const DEFAULT_CURRENCY = 'CZK'
const EMV_HEADER = 'SPD*1.0*'

const formatMoney = (locale, amount, currency) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    parseFloat(amount)
  )

export const Money = ({ amount, currency = DEFAULT_CURRENCY, ...props }) => (
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

export const PaymentQrCode = ({
  amount,
  bic,
  currency,
  iban,
  message,
  variableSymbol,
}) => {
  const codeVars = Object.entries({
    ACC: `${iban}+${bic}`,
    AM: amount,
    CC: currency,
    RF: variableSymbol,
    MSG: message,
    'X-VS': variableSymbol,
  })
    .map((entry) => entry.join(':'))
    .join('*')
  const code = `${EMV_HEADER}${codeVars}`
  return <QrCode value={code} />
}
