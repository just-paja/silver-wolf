import classnames from 'classnames'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { ArticleBody } from './articles'
import { DateRange } from './dates'
import { Heading } from './media'
import { InteractiveButton } from './buttons'
import { Link } from './links'
import { LocationFuzzyName } from './locations'
import { PriceLabel } from './money'
import { reverse } from '../routes'
import { slug } from './slugs'
import { SignupDialog } from './signups'
import { TroopLabel } from './troops'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  useActiveOrder,
  useSetActiveOrder,
  useSite,
  useToasts,
} from './context'

import styles from './expeditions.module.scss'

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
  const router = useRouter()
  const [show, setShow] = useState(router?.query?.action === 'signup')
  const { t } = useTranslation()
  const { fetch, lang, user } = useSite()
  const [participants, setParticipants] = useState([])
  const order = useActiveOrder()
  const setOrder = useSetActiveOrder()
  const hideDialog = () => setShow(false)
  const toasts = useToasts()
  const loginFirst = () => {
    const redirectPath = reverse(lang, 'expeditionDetail', {
      expeditionSlug: slug(expedition),
    })
    const query = '?action=signup'
    const redirectTo = `${redirectPath}${query}`
    router.push(
      `${reverse(lang, 'login')}?redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }
  const showDialog = async () => {
    const p = await fetch('/participants')
    setParticipants(p.results)
    setShow(true)
  }
  const addParticipant = (participant) => {
    setParticipants([...participants, participant])
  }
  const createSignup = async (values) => {
    await fetch.post('/signups', {
      body: {
        ...values,
        orderId: order?.id,
      },
    })
    const o = await fetch('/orders/active')
    toasts.add({
      subject: t('signup-was-created'),
      message: t('signup-created-buy-it'),
      actions: [
        {
          message: t('go-to-basket'),
          route: 'basket',
        },
      ],
    })
    setOrder(o)
    hideDialog()
  }
  return (
    <>
      <SignupDialog
        expedition={expedition}
        batch={batch}
        show={show}
        participants={participants}
        onAddParticipant={addParticipant}
        onCreateSignup={createSignup}
        onHide={hideDialog}
      />
      <InteractiveButton
        className={styles.signupButton}
        onClick={user ? showDialog : loginFirst}
      >
        {t('signup-to-expedition')}
      </InteractiveButton>
    </>
  )
}

const ExpeditionBatch = ({ batch, expedition }) => {
  const { t } = useTranslation()
  const lowestPrice = batch.troops.reduce((aggr, troop) => {
    const priceObj = troop.prices.find((p) => p.active)
    const priceStr = priceObj?.price
    const price = priceStr ? parseFloat(priceStr) : null
    return aggr === null || aggr > price ? price : aggr
  }, null)
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
          {lowestPrice && (
            <p>
              <PriceLabel price={lowestPrice} />
            </p>
          )}
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

export const ExpeditionBatchSummary = ({ batches, expedition, className }) => {
  const defaultBase = getDefaultBase(batches)
  return (
    <div className={className}>
      {batches.map((batch) => (
        <Link
          key={batch.id}
          route="expeditionBatchDetail"
          params={{
            expeditionBatchSlug: slug(batch.id, expedition.title),
          }}
        >
          <ExpeditionBatchStamp batch={batch} showBase={!defaultBase} />
        </Link>
      ))}
      {defaultBase ? (
        <>
          <LeisureCentreSummary leisureCentre={defaultBase} />
        </>
      ) : null}
    </div>
  )
}
