import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Markdown from 'react-markdown'

import { AddressLine, joinAddressValue } from './addresses'
import { Heading, ThumbGallery } from './media'
import { DateRange } from './dates'
import { useTranslation } from 'next-i18next'

const ExpeditionBatch = ({ batch }) => {
  return (
    <div>
      <DateRange start={batch.startsAt} end={batch.endsAt} />
    </div>
  )
}

export const ExpeditionBatches = ({ batches }) => {
  const { t } = useTranslation()
  if (batches.length === 0) {
    return null
  }
  return (
    <div className="mt-3">
      <Heading level={2}>{t('expedition-batches')}</Heading>
      {batches.map((batch) => (
        <ExpeditionBatch batch={batch} key={batch.id} />
      ))}
    </div>
  )
}

const LocationAddress = ({ location, title }) => (
  <address>
    <AddressLine value={title} />
    {title !== location.name && <AddressLine value={location.name} />}
    <AddressLine value={location.city} />
    <AddressLine value={[location.street, location.streetNumber]} />
    <AddressLine value={[location.postalCode, location.country?.name]} />
  </address>
)

const LocationMap = ({ location }) => {
  const key = 'AIzaSyDZAOm63J4-B0hXyWW0dC9wr8gug5JEnN0'
  const query =
    location.lat && location.lng
      ? `${location.lat},${location.lng}`
      : encodeURIComponent(
          joinAddressValue(
            [
              location.country?.name,
              location.city,
              location.street,
              location.streetNumber,
              location.postalCode,
            ],
            ', '
          )
        )

  const src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}`
  return <iframe src={src} />
}

export const ExpeditionBase = ({ base }) => {
  const { t } = useTranslation()
  return (
    <section className="mt-3">
      <header>
        <Heading level={2}>{t('expedition-base-location')}</Heading>
        <p>{base.title}</p>
      </header>
      <Markdown>{base.description}</Markdown>
      <ThumbGallery media={base.media} />
      <Row className="mt-3">
        <Col sm={6} lg={4} xl={3}>
          <Heading level={3}>{t('leisure-centre-location')}</Heading>
          <LocationAddress location={base.location} title={base.title} />
        </Col>
        {base.mailingAddress && (
          <Col sm={6}>
            <Heading level={3}>{t('leisure-centre-mailing-address')}</Heading>
            <LocationAddress
              location={base.mailingAddress}
              title={base.title}
            />
          </Col>
        )}
      </Row>
      <LocationMap location={base.location} />
    </section>
  )
}

export const getDefaultBase = (batches) => {
  const defaultBatch = batches[0]
  const defaultId = defaultBatch?.leisureCentre?.id
  const allEqual = batches.every(
    (batch) => batch?.leisureCentre?.id === defaultId
  )
  return allEqual ? defaultBatch?.leisureCentre : null
}
