import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { ArticleBody, ArticleLead } from '../../components/articles'
import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { asStatusCodePage } from '../../components/references'
import { Heading } from '../../components/media'
import { GenericPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import { ThumbGallery } from '../../components/media'
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
  const defaultBase = getDefaultBase(expedition.batches)
  return (
    <GenericPage>
      <MetaPage title={expedition.title} description={expedition.description} />
      <Container as="article" className="mt-3">
        <Row>
          <Col lg={6}>
            <Heading>{expedition.title}</Heading>
            <ArticleLead text={expedition.description} />
            <ArticleBody text={expedition.detailed_description} />
            <ExpeditionBatches
              batches={expedition.batches}
              expedition={expedition}
            />
            {expedition.theme ? (
              <ExpeditionTheme theme={expedition.theme} />
            ) : null}
            {defaultBase ? <ExpeditionBase base={defaultBase} /> : null}
          </Col>
          <Col lg={6}>
            <ThumbGallery media={expedition.media} />
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(asStatusCodePage(ExpeditionDetail))
