import { Input } from './forms'

import styles from './addresses.module.scss'

export const OptionalBreak = ({ br }) => (br ? <br /> : null)

export const joinAddressValue = (value, delimiter = ' ') =>
  Array.isArray(value) ? value.filter(Boolean).join(delimiter) : value

export const AddressLine = ({ br = true, value }) => {
  const strValue = joinAddressValue(value)
  return strValue ? (
    <>
      {strValue}
      <OptionalBreak br={strValue && br} />
    </>
  ) : null
}

export const Address = ({ title, street, streetNumber, city, postalCode }) => {
  return (
    <address>
      <AddressLine value={title} />
      <AddressLine value={[street, streetNumber]} />
      <AddressLine value={city} />
      <AddressLine value={postalCode} />
    </address>
  )
}

export const PostalCodeInput = (props) => (
  <Input {...props} className={styles.postalCodeInput} />
)

export const StreetNumberInput = (props) => (
  <Input {...props} className={styles.streetNumberInput} />
)
