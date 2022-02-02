import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { asStatusCodePage } from '../../components/references'
import { BatchTroops, Team } from '../../components/batches'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { DateRange, formatDateRange } from '../../components/dates'
import { GenericPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { Heading } from '../../components/media'
import { LeisureCentreStub } from '../../components/leisureCentres'
import { parseSlug } from '../../components/slugs'
import { slug } from '../../components/slugs'
import { useTranslation } from 'next-i18next'

export const getExpeditionBatch = async (expeditionBatchId) => {
  try {
    return await apiFetch(`/expedition-batches/${expeditionBatchId}`)
  } catch (e) {
    if (e instanceof NotFound) {
      return null
    }
    throw e
  }
}

export const getServerSideProps = async (props) => {
  const expeditionBatchId = parseSlug(props.params.expeditionBatchSlug)
  const expeditionBatch = await getExpeditionBatch(expeditionBatchId)
  return {
    props: {
      expeditionBatchId,
      expeditionBatch,
      statusCode: expeditionBatch ? 200 : 404,
      ...(await getPageProps(props)).props,
    },
  }
}

const ExpeditionBatchDetailPage = ({ expeditionBatch }) => {
  const { expedition } = expeditionBatch
  const batch = expeditionBatch
  const { i18n, t } = useTranslation()
  const title = `${expedition.title}: ${formatDateRange(
    i18n.language,
    batch.startsAt,
    batch.endsAt
  )}`
  return (
    <GenericPage>
      <MetaPage title={title} description={expedition.description} />
      <Container as="article" className="mt-3">
        <Breadcrumbs
          links={[
            { route: 'adventureList', children: t('adventures-title') },
            {
              route: 'expeditionDetail',
              params: { expeditionSlug: slug(expedition) },
              children: expedition.title,
            },
            {
              children: (
                <DateRange
                  start={expeditionBatch.startsAt}
                  end={expeditionBatch.endsAt}
                />
              ),
            },
          ]}
        />
        <header>
          <Heading>{expedition.title}</Heading>
          <p className="fs-3">
            <DateRange start={batch.startsAt} end={batch.endsAt} />
          </p>
        </header>
        <Row>
          <Col lg={6}>
            <BatchTroops troops={batch.troops} />
          </Col>
          <Col lg={6}>
            <LeisureCentreStub leisureCentre={batch.leisureCentre} />
          </Col>
        </Row>
        <Team team={batch.staff} />
      </Container>
    </GenericPage>
  )
}

export default asPage(asStatusCodePage(ExpeditionBatchDetailPage))
