import classnames from 'classnames'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { ArticleBody } from './articles'
import { DateRange } from './dates'
import { GeneralNewsletterForm } from './GeneralNewsletterForm'
import { Heading } from './media'
import { Link } from './links'
import { LocationFuzzyName } from './locations'
import { slug } from './slugs'
import { useTranslation } from 'next-i18next'
import { IconLabel, PersonIcon } from './icons'

import styles from './expeditions.module.scss'

const getExpeditionLength = (startsAt, endsAt) =>
  Math.max((new Date(endsAt) - new Date(startsAt)) / 1000 / 60 / 60 / 24 - 1, 1)

const TroopLabel = ({ ageMin, ageMax, startsAt, endsAt }) => {
  const { t } = useTranslation()
  return (
    <IconLabel
      icon={PersonIcon}
      text={`${t('age-limit', { ageMin, ageMax })}, ${t('expedition-length', {
        daysLength: getExpeditionLength(startsAt, endsAt),
      })}`}
    />
  )
}

const Troop = ({ ageMin, ageMax, startsAt, endsAt }) => {
  return (
    <div>
      <TroopLabel
        ageMin={ageMin}
        ageMax={ageMax}
        startsAt={startsAt}
        endsAt={endsAt}
      />
    </div>
  )
}

const SignupPopup = ({ onHide, show }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Přihlášky ještě nejsou otevřené</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Na tábor se zatím přihlásit nedá, ale když nám zanecháte váš e-mail,
          pošleme vám na něj promo kód s 5% slevou jakmile se otevřou.
        </p>
        <hr />
        <GeneralNewsletterForm hideTitle />
      </Modal.Body>
    </Modal>
  )
}

const SignupButton = (props) => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  return (
    <>
      <Button {...props} onClick={handleShow}>
        Přihlásit na tábor
      </Button>
      <SignupPopup show={show} onHide={handleClose} />
    </>
  )
}

const ExpeditionBatch = ({ batch, expedition }) => {
  const { t } = useTranslation()
  return (
    <div className={classnames('mt-3', styles.batch)}>
      <Row>
        <Col xl={6}>
          <Heading relativeLevel={3}>
            <Link
              route="expeditionBatchDetail"
              params={{ expeditionBatchSlug: slug(batch.id, expedition.title) }}
            >
              <DateRange start={batch.startsAt} end={batch.endsAt} />
            </Link>
          </Heading>
          <p>
            <LocationFuzzyName location={batch.leisureCentre.location} />
          </p>
          <div>
            {batch.troops.map((troop) => (
              <Troop
                key={troop.id}
                ageMax={troop.ageGroup.ageMax}
                ageMin={troop.ageGroup.ageMin}
                endsAt={troop.endsAt}
                startsAt={troop.startsAt}
              />
            ))}
          </div>
        </Col>
        <Col className={styles.batchButtons} xl={6}>
          {batch.troops.length === 0 ? null : <SignupButton />}
          <Link
            as={Button}
            size="md"
            variant="secondary"
            route="expeditionBatchDetail"
            params={{ expeditionBatchSlug: slug(batch.id, expedition.title) }}
          >
            {t('expedition-batch-more-info')}
          </Link>
        </Col>
      </Row>
    </div>
  )
}

export const ExpeditionBatches = ({ expedition, batches }) => {
  const { t } = useTranslation()
  if (batches.length === 0) {
    return null
  }
  return (
    <div className="mt-3">
      <Heading level={2}>{t('expedition-batches')}</Heading>
      {batches.map((batch) => (
        <ExpeditionBatch batch={batch} expedition={expedition} key={batch.id} />
      ))}
    </div>
  )
}

export const ExpeditionBase = ({ base }) => {
  const { t } = useTranslation()
  return (
    <section className="mt-3">
      <header>
        <Heading level={2}>
          <Link
            route="leisureCentreDetail"
            params={{
              leisureCentreSlug: slug(base),
            }}
          >
            {t('expedition-where-is-it')}
          </Link>
        </Heading>
        <p>{base.title}</p>
      </header>
      <ArticleBody text={base.description} />
      <div className="mt-3">
        <Link
          as={Button}
          route="leisureCentreDetail"
          params={{
            leisureCentreSlug: slug(base),
          }}
          variant="secondary"
        >
          {t('expedition-base-more-info')}
        </Link>
      </div>
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

export const ExpeditionTheme = ({ theme }) => {
  const { t } = useTranslation()
  return (
    <section className="mt-3">
      <header>
        <Heading level={2}>
          <Link
            route="adventureDetail"
            params={{
              expeditionThemeSlug: slug(theme),
            }}
          >
            {t('expedition-what-is-it-about')}
          </Link>
        </Heading>
      </header>
      <ArticleBody text={theme.description} />
      <div className="mt-3">
        <Link
          as={Button}
          route="adventureDetail"
          params={{
            expeditionThemeSlug: slug(theme),
          }}
          variant="secondary"
        >
          {t('expedition-theme-more-info')}
        </Link>
      </div>
    </section>
  )
}

const LeisureCentreSummary = ({ leisureCentre }) => {
  return (
    <span className={styles.baseStamp}>
      {leisureCentre.location?.fuzzyName ||
        leisureCentre.location?.title ||
        leisureCentre.title}
    </span>
  )
}

const ExpeditionBatchStamp = ({ batch, showBase = true }) => {
  return (
    <div>
      <DateRange start={batch.startsAt} end={batch.endsAt} />
      {showBase ? (
        <>
          <br />
          {batch.leisureCentre ? (
            <LeisureCentreSummary leisureCentre={batch.leisureCentre} />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export const ExpeditionBatchSummary = ({ batches, className }) => {
  const defaultBase = getDefaultBase(batches)
  return (
    <div className={className}>
      {batches.map((batch) => (
        <ExpeditionBatchStamp
          batch={batch}
          key={batch.id}
          showBase={!defaultBase}
        />
      ))}
      {defaultBase ? (
        <>
          <LeisureCentreSummary leisureCentre={defaultBase} />
        </>
      ) : null}
    </div>
  )
}
