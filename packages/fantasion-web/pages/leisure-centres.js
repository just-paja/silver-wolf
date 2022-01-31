import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { getPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'
import { apiFetch } from '../api'
import { Article } from '../components/articles'
import { LocationAddress } from '../components/locations'

const fetchLeisureCentres = async () => await apiFetch('/leisure-centres')

export const getServerSideProps = async (props) => {
  return {
    props: {
      ...(await getPageProps(props)).props,
      leisureCentres: await fetchLeisureCentres(),
    },
  }
}

const LeisureCentreLocationBlock = ({ location, mailingAddress }) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col className="mt-3" md={6}>
        <Card>
          <Card.Body>
            <LocationAddress
              location={location}
              title={t('leisure-centre-location')}
            />
          </Card.Body>
        </Card>
      </Col>
      {mailingAddress ? (
        <Col className="mt-3" md={6}>
          <Card>
            <Card.Body>
              <LocationAddress
                location={mailingAddress}
                title={t('leisure-centre-mailing-address')}
              />
            </Card.Body>
          </Card>
        </Col>
      ) : null}
    </Row>
  )
}

const LeisureCentre = ({ leisureCentre }) => (
  <Article
    description={leisureCentre.description}
    media={leisureCentre.media}
    beforeText={
      <LeisureCentreLocationBlock
        location={leisureCentre.location}
        mailingAddress={leisureCentre.mailingAddress}
      />
    }
    text={leisureCentre.detailedDescription}
    title={leisureCentre.title}
  />
)

const LeisureCentreList = ({ leisureCentres }) =>
  leisureCentres.map((leisureCentre) => (
    <LeisureCentre key={leisureCentre.id} leisureCentre={leisureCentre} />
  ))

const LeisureCentresPage = ({ leisureCentres }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('leisure-centre-title')}
        description={t('fantasion-general-description')}
      />
      <LeisureCentreList leisureCentres={leisureCentres.results} />
    </GenericPage>
  )
}

export default asPage(LeisureCentresPage)
