import { useTranslation } from 'next-i18next'

const getFormat = (locale) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'numeric',
  })

export const formatDateRange = (lang, start, end) =>
  getFormat(lang).formatRange(new Date(start), new Date(end)).replace(' ', ' ')

export const DateRange = ({ start, end }) => {
  const { i18n } = useTranslation()
  return (
    <time dateTime={`${start}/${end}`}>
      {formatDateRange(i18n.language, start, end)}
    </time>
  )
}

export const getDaysDuration = (startsAt, endsAt) =>
  Math.max((new Date(endsAt) - new Date(startsAt)) / 1000 / 60 / 60 / 24 - 1, 1)
