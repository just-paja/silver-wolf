import Button from 'react-bootstrap/Button'
import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { ExpeditionBatchSummary } from './expeditions'
import { slug } from './slugs'
import { SlideShowGallery, Heading } from './media'
import { GeneralNewsletterForm } from './GeneralNewsletterForm'
import { Link } from './links'
import { MarkdownContent } from './content'
import { useTranslation } from 'next-i18next'

import styles from './ExpeditionList.module.scss'

const ExpeditionC2A = ({ expedition }) => {
  const { t } = useTranslation()
  return (
    <div className="mt-3">
      <Link
        as={Button}
        route="expeditionDetail"
        params={{ expeditionSlug: slug(expedition) }}
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
        md={expedition.media.length === 0 ? 12 : 6}
        className={classnames(
          'd-flex align-items-center',
          styles.descriptionColumn
        )}
      >
        <div className={styles.expeditionDescription}>
          <Heading>
            <Link
              route="expeditionDetail"
              params={{ expeditionSlug: slug(expedition) }}
            >
              {expedition.title}
            </Link>
          </Heading>
          <MarkdownContent>{expedition.description}</MarkdownContent>
          <ExpeditionBatchSummary
            batches={expedition.batches}
            className={styles.batches}
          />
          <ExpeditionC2A expedition={expedition} />
        </div>
      </Col>
      {expedition.media.length === 0 ? null : (
        <Col
          md={6}
          className={classnames(
            'd-flex align-items-center',
            styles.galleryColumn
          )}
        >
          <SlideShowGallery media={expedition.media} square />
        </Col>
      )}
    </Row>
  )
}

// @TODO: Design expeditions empty state
const NoExpeditions = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <div className="above-decoration p-4 bg-primary text-white">
        <p>{t('expedition-list-empty')}</p>
        <GeneralNewsletterForm
          title={t('expedition-get-in-touch')}
          variant="secondary"
        />
      </div>
    </Container>
  )
}

export const ExpeditionList = ({ expeditions, ...props }) => {
  if (expeditions.results.length === 0) {
    return <NoExpeditions />
  }
  return (
    <Container fluid="lg" {...props}>
      {expeditions.results.map((expedition) => (
        <Expedition expedition={expedition} key={expedition.id} />
      ))}
    </Container>
  )
}
