import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Error from 'next/error'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Markdown from 'react-markdown'

import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { Heading } from '../../components/media'
import { GalleryPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import {
  ExpeditionBatches,
  getDefaultBase,
  ExpeditionBase,
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

const ExpeditionDetail = ({ expedition, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />
  }
  const defaultBase = getDefaultBase(expedition.batches)
  return (
    <GalleryPage media={expedition.media}>
      <MetaPage title={expedition.title} description={expedition.description} />
      <Container className="pt-5 pt-xl-3">
        <Row className="pt-3 pt-xl-0">
          <Col>
            <Heading>{expedition.title}</Heading>
            <Markdown>{expedition.description}</Markdown>
            <ExpeditionBatches batches={expedition.batches} />
            {defaultBase && <ExpeditionBase base={defaultBase} />}
          </Col>
        </Row>
      </Container>
    </GalleryPage>
  )
}

export default asPage(ExpeditionDetail)
