import ListGroup from 'react-bootstrap/ListGroup'

import { ArticleBody } from './articles'
import { DateTimeLabel } from './dates'
import { LocationAddress } from './locations'
import { Heading, Section, ThumbGallery } from './media'
import { useTranslation } from 'next-i18next'
import { DateTimeIcon, DownIcon, IconLabel } from './icons'

const ItineraryStep = ({ location, date, title }) => {
  if (!date || !location) {
    return null
  }
  return (
    <div>
      <Heading>{title}</Heading>
      <IconLabel icon={DateTimeIcon} text={<DateTimeLabel date={date} />} />
      <LocationAddress location={location} />
    </div>
  )
}

export const Itinerary = ({ transport }) => {
  const { t } = useTranslation()
  return (
    <Section>
      {transport.description && <ArticleBody text={transport.description} />}
      <ItineraryStep
        date={transport.departsAt}
        location={transport.departsFrom}
        title={t('transport-departure')}
      />
      <DownIcon />
      <ItineraryStep
        date={transport.arrivesAt}
        location={transport.arrivesTo}
        title={t('transport-arrival')}
      />
    </Section>
  )
}

export const Vehicle = ({ vehicle }) => {
  const { t } = useTranslation()
  return (
    <Section>
      {vehicle.title && <Heading>{vehicle.title}</Heading>}
      {vehicle.description && <ArticleBody text={vehicle.description} />}
      <ListGroup className="mt-3">
        {(vehicle.brand || vehicle.model) && (
          <ListGroup.Item>
            {t('vehicle-model')}: {vehicle.brand} {vehicle.model}
          </ListGroup.Item>
        )}
        {vehicle.color && (
          <ListGroup.Item>
            {t('vehicle-color')}: {vehicle.color}
          </ListGroup.Item>
        )}
        {vehicle.year && (
          <ListGroup.Item>
            {t('vehicle-year')}: {vehicle.year}
          </ListGroup.Item>
        )}
      </ListGroup>
      <ThumbGallery media={vehicle.media} />
    </Section>
  )
}
