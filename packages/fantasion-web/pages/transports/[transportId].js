import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../../components/meta'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import {
  Itinerary,
  Vehicle,
  TransportTroops,
} from '../../components/transports'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../../server/props'

import styles from './[transportId].module.scss'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => {
  const transportId = params.transportId
  const transport = await fetch(`/transports/${transportId}`)
  return {
    props: {
      transport,
      transportId,
    },
  }
})

const TransportDetailPage = ({ transport, transportId }) => {
  const { t } = useTranslation()
  const title = t('transport-detail', { transportId })
  return (
    <GenericPage thin>
      <MetaPage title={title} />
      <Container as="article" className={classnames('mt-3', styles.page)}>
        <Breadcrumbs
          links={[
            { route: 'adventureList', children: t('adventures-title') },
            { children: title },
          ]}
        />
        <header>
          <Heading>{title}</Heading>
        </header>
        <Row>
          <Col md={6} lg={5} xl={6} className="mt-3">
            <Itinerary transport={transport} />
            <TransportTroops troopTransports={transport.troopTransports} />
          </Col>
          <Col md={6} lg={5} xl={6} className="mt-3">
            <Vehicle vehicle={transport.vehicle} />
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(TransportDetailPage)
