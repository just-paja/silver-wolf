import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { ArticleBody, ArticleLead } from '../../components/articles'
import { asPage, MetaPage } from '../../components/meta'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { LeisureCentreStub } from '../../components/leisureCentres'
import { parseSlug, slug } from '../../components/slugs'
import { ThumbGallery } from '../../components/media'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../../server/props'
import {
  ExpeditionBatches,
  ExpeditionTheme,
  getDefaultBase,
} from '../../components/expeditions'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => {
  const expeditionId = parseSlug(params.expeditionSlug)
  const expedition = await fetch(`/expeditions/${expeditionId}`)
  return {
    props: {
      expeditionId,
      expedition,
    },
  }
})

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
            {defaultBase ? (
              <LeisureCentreStub leisureCentre={defaultBase} />
            ) : null}
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(ExpeditionDetail)
