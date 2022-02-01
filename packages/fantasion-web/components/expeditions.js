import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { ArticleBody } from './articles'
import { Heading } from './media'
import { DateRange } from './dates'
import { GeneralNewsletterForm } from './GeneralNewsletterForm'
import { Link } from './links'
import { slug } from './slugs'
import { useTranslation } from 'next-i18next'

import styles from './expeditions.module.scss'

const ExpeditionBatch = ({ batch }) => {
  return (
    <Row className="mt-1 d-flex align-items-center">
      <Col>
        <strong>
          <DateRange start={batch.startsAt} end={batch.endsAt} />
        </strong>
      </Col>
    </Row>
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

const SignupButton = () => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button size="lg" onClick={handleShow}>
        Přihlásit na tábor
      </Button>
      <SignupPopup show={show} onHide={handleClose} />
    </>
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
      <Row>
        <Col sm={6}>
          {batches.map((batch) => (
            <ExpeditionBatch batch={batch} key={batch.id} />
          ))}
        </Col>
        <Col sm={6} className="mt-2 d-flex justify-content-end">
          <SignupButton />
        </Col>
      </Row>
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
