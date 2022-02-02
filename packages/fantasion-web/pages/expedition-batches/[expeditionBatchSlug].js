import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { asStatusCodePage } from '../../components/references'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Heading } from '../../components/media'
import { GenericPage } from '../../components/layout'
import { DateRange } from '../../components/dates'
import { getPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import { ThumbGallery } from '../../components/media'
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
  const { t } = useTranslation()
  const title = `${expedition.title}: ${expeditionBatch.id}`
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
        <Row>
          <Col lg={6}>
            <Heading>{title}</Heading>
          </Col>
          <Col lg={6}></Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(asStatusCodePage(ExpeditionBatchDetailPage))
