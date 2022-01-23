import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Error from 'next/error'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Markdown from 'react-markdown'

import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { Heading, ThumbGallery } from '../../components/media'
import { DateRange } from '../../components/dates'
import { GenericPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import { useTranslation } from 'next-i18next'

export const getExpedition = async (expeditionId) => {
  try {
    return await apiFetch(`/expeditions/${expeditionId}`)
  } catch (e) {
    if (e instanceof NotFound) {
      return null
    }
    throw e
  }
}

export const getServerSideProps = async (props) => {
  const expeditionId = parseSlug(props.params.expeditionSlug)
  const expedition = await getExpedition(expeditionId)
  return {
    props: {
      expeditionId,
      expedition,
      statusCode: expedition ? 200 : 404,
      ...(await getPageProps(props)).props,
    },
  }
}

const ExpeditionBatch = ({ batch }) => {
  return (
    <div>
      <DateRange start={batch.startsAt} end={batch.endsAt} />
    </div>
  )
}

const ExpeditionBatches = ({ batches }) => {
  const { t } = useTranslation()
  if (batches.length === 0) {
    return 0
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

const OptionalBreak = ({ br }) => (br ? <br /> : null)

const joinValue = (value, delimiter = ' ') =>
  Array.isArray(value) ? value.filter(Boolean).join(delimiter) : value

const AddressLine = ({ br = true, value }) => {
  const strValue = joinValue(value)
  return strValue ? (
    <>
      {strValue}
      <OptionalBreak br={br} />
    </>
  ) : null
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
          joinValue(
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

const ExpeditionBase = ({ base }) => {
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

const getDefaultBase = (batches) => {
  const defaultBatch = batches[0]
  const defaultId = defaultBatch?.leisureCentre?.id
  const allEqual = batches.every(
    (batch) => batch?.leisureCentre?.id === defaultId
  )
  return allEqual ? defaultBatch?.leisureCentre : null
}

const ExpeditionDetail = ({ expedition, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />
  }
  const defaultBase = getDefaultBase(expedition.batches)
  return (
    <GenericPage>
      <MetaPage title={expedition.title} description={expedition.description} />
      <Container>
        <Row>
          <Col>
            <Heading>{expedition.title}</Heading>
            <Markdown>{expedition.description}</Markdown>
            <ExpeditionBatches batches={expedition.batches} />
            {defaultBase && <ExpeditionBase base={defaultBase} />}
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(ExpeditionDetail)
