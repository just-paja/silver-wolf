import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { ArticleBody, ArticleLead } from '../../components/articles'
import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { asStatusCodePage } from '../../components/references'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { Heading } from '../../components/media'
import { GenericPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { parseSlug, slug } from '../../components/slugs'
import { ThumbGallery } from '../../components/media'
import { useTranslation } from 'next-i18next'
import {
  ExpeditionBase,
  ExpeditionBatches,
  ExpeditionTheme,
  getDefaultBase,
} from '../../components/expeditions'

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

const ExpeditionDetail = ({ expedition }) => {
  const { t } = useTranslation()
  const defaultBase = getDefaultBase(expedition.batches)
  return (
    <GenericPage>
      <MetaPage title={expedition.title} description={expedition.description} />
      <Container as="article" className="mt-3">
        <Breadcrumbs
          links={[
            { route: 'adventureList', children: t('adventures-title') },
            {
              route: 'expeditionDetail',
              params: { expeditionSlug: slug(expedition) },
              children: expedition.title,
            },
          ]}
        />
        <Row>
          <Col lg={6}>
            <Heading>{expedition.title}</Heading>
            <ArticleLead text={expedition.description} />
            <ArticleBody text={expedition.detailed_description} />
          </Col>
          <Col lg={6}>
            <ExpeditionBatches
              batches={expedition.batches}
              expedition={expedition}
            />
          </Col>
          <Col lg={6}>
            <ThumbGallery className="mt-3" media={expedition.media} />
          </Col>
          <Col lg={6}>
            {expedition.theme ? (
              <ExpeditionTheme theme={expedition.theme} />
            ) : null}
          </Col>
          <Col lg={6}>
            {defaultBase ? <ExpeditionBase base={defaultBase} /> : null}
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(asStatusCodePage(ExpeditionDetail))
