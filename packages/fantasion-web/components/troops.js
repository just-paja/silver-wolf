import { getDaysDuration } from './dates'
import { IconLabel, PersonIcon } from './icons'
import { useTranslation } from 'next-i18next'

export const TroopLabel = ({ ageMin, ageMax, startsAt, endsAt }) => {
  const { t } = useTranslation()
  return (
    <IconLabel
      icon={PersonIcon}
      text={`${t('age-limit', { ageMin, ageMax })}, ${t('expedition-length', {
        daysLength: getDaysDuration(startsAt, endsAt),
      })}`}
    />
  )
}
