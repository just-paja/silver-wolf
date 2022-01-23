import { useTranslation } from 'next-i18next'

const getFormat = (locale) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'numeric',
  })

export const DateRange = ({ start, end }) => {
  const { i18n } = useTranslation()
  return (
    <time dateTime={`${start}/${end}`}>
      {getFormat(i18n.language).formatRange(new Date(start), new Date(end))}
    </time>
  )
}
