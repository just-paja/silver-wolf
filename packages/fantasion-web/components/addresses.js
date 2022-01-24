export const OptionalBreak = ({ br }) => (br ? <br /> : null)

export const joinAddressValue = (value, delimiter = ' ') =>
  Array.isArray(value) ? value.filter(Boolean).join(delimiter) : value

export const AddressLine = ({ br = true, value }) => {
  const strValue = joinAddressValue(value)
  return strValue ? (
    <>
      {strValue}
      <OptionalBreak br={br} />
    </>
  ) : null
}
