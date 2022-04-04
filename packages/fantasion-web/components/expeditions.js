import classnames from 'classnames'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { ArticleBody } from './articles'
import { DateRange } from './dates'
import { Heading } from './media'
import { Link } from './links'
import { LocationFuzzyName } from './locations'
import { reverse } from '../routes'
import { slug } from './slugs'
import { TroopLabel } from './troops'
import { useTranslation } from 'next-i18next'
import { useSite } from './context'

import styles from './expeditions.module.scss'

export const ExpeditionContext = React.createContext(null)
export const useExpedition = () => React.useContext(ExpeditionContext)

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

export const SignupButton = ({ expedition, batch }) => {
  const { t } = useTranslation()
  const { lang, user } = useSite()
  const expeditionSlug = slug(expedition.id, expedition.title)
  const query = user
    ? { batchId: batch?.id }
    : {
        redirectTo: reverse(lang, 'expeditionSignup', { expeditionSlug }),
      }
  return (
    <Link
      as={Button}
      className={styles.signupButton}
      route={user ? 'expeditionSignup' : 'login'}
      params={{ expeditionSlug }}
      query={query}
    >
      {t('signup-to-expedition')}
    </Link>
  )
}

const ExpeditionBatch = ({ batch, expedition }) => {
  const { t } = useTranslation()
  return (
    <div className={classnames('mt-3', styles.batch)}>
      <Row>
        <Col lg={6}>
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
        <Col className={styles.batchButtons} lg={6}>
          {batch.troops.length === 0 ? null : (
            <SignupButton expedition={expedition} />
          )}
          <Link
            as={Button}
            className={styles.detailsButton}
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
