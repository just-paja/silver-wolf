import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { Heading, ThumbGallery } from './media'
import { DateRange } from './dates'
import { LocationAddress, LocationMap } from './locations'
import { MarkdownContent } from './content'
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

export const ExpeditionBase = ({ base }) => {
  const { t } = useTranslation()
  return (
    <section className="mt-3">
      <header>
        <Heading level={2}>{t('expedition-base-location')}</Heading>
        <p>{base.title}</p>
      </header>
      <MarkdownContent>{base.description}</MarkdownContent>
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
