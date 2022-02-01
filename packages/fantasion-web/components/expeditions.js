import Button from 'react-bootstrap/Button'
import React from 'react'

import { ArticleBody } from './articles'
import { Heading } from './media'
import { DateRange } from './dates'
import { Link } from './links'
import { slug } from './slugs'
import { useTranslation } from 'next-i18next'

import styles from './expeditions.module.scss'

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
        <Heading level={2}>{t('expedition-where-is-it')}</Heading>
        <p>{base.title}</p>
      </header>
      <ArticleBody text={base.description} />
      <div className="mt-3">
        <Link
          as={Button}
          route="leisureCentreDetail"
          params={{
            leisureCentreSlug: slug(base.id, base.title),
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
        <Heading level={2}>{t('expedition-what-is-it-about')}</Heading>
      </header>
      <ArticleBody text={theme.description} />
      <div className="mt-3">
        <Link
          as={Button}
          route="expeditionThemeDetail"
          params={{
            expeditionThemeSlug: slug(theme.id, theme.title),
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
