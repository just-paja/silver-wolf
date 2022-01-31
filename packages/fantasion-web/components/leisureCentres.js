import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { useTranslation } from 'next-i18next'
import { Article } from '../components/articles'
import { LocationAddress } from '../components/locations'

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

export const LeisureCentre = ({ leisureCentre }) => (
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

export const LeisureCentreList = ({ leisureCentres }) =>
  leisureCentres.map((leisureCentre) => (
    <LeisureCentre key={leisureCentre.id} leisureCentre={leisureCentre} />
  ))
