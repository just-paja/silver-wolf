import Button from 'react-bootstrap/Button'
import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Markdown from 'react-markdown'
import Row from 'react-bootstrap/Row'

import { SlideShowGallery, Heading } from './media'
import { DateRange } from './dates'
import { Link } from './links'
import { useTranslation } from 'next-i18next'

import styles from './ExpeditionList.module.scss'

const LeisureCentreSummary = ({ leisureCentre }) => {
  return leisureCentre.title
}

const ExpeditionBatchStamp = ({ batch }) => {
  return (
    <div>
      <DateRange start={batch.startsAt} end={batch.endsAt} />
      <br />
      {batch.leisureCentre ? (
        <LeisureCentreSummary leisureCentre={batch.leisureCentre} />
      ) : null}
    </div>
  )
}

const ExpeditionBatches = ({ batches }) => (
  <div className={styles.batches}>
    {batches.map((batch) => (
      <ExpeditionBatchStamp batch={batch} key={batch.id} />
    ))}
  </div>
)

const ExpeditionC2A = () => {
  const { t } = useTranslation()
  return (
    <div className="mt-3">
      <Link
        as={Button}
        route="home"
        size="lg"
        variant="secondary"
        className={styles.bfb}
      >
        {t('expedition-button-more-info')}
      </Link>
    </div>
  )
}

const Expedition = ({ expedition }) => {
  return (
    <Row as="article" className={styles.expedition}>
      <Col
        md={6}
        className={classnames(
          'd-flex align-items-center',
          styles.descriptionColumn
        )}
      >
        <div className={styles.expeditionDescription}>
          <Heading>{expedition.title}</Heading>
          <Markdown>{expedition.description}</Markdown>
          <ExpeditionBatches batches={expedition.batches} />
          <ExpeditionC2A expedition={expedition} />
        </div>
      </Col>
      <Col
        md={6}
        className={classnames(
          'd-flex align-items-center',
          styles.galleryColumn
        )}
      >
        <SlideShowGallery media={expedition.media} />
      </Col>
    </Row>
  )
}

// @TODO: Design expeditions empty state
const NoExpeditions = () => null

export const ExpeditionList = ({ expeditions }) => {
  if (expeditions.results.length === 0) {
    return <NoExpeditions />
  }
  return (
    <Container fluid="lg">
      {expeditions.results.map((expedition) => (
        <Expedition expedition={expedition} key={expedition.id} />
      ))}
    </Container>
  )
}
