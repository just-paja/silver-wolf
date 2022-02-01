import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { Article } from './articles'
import { ExpeditionLinks } from './expeditionLinks'
import { slug } from './slugs'

const ProfileListItem = ({ profile }) => {
  return (
    <Card>
      <Card.Img variant="top" src={profile.media[0].localPhoto.galleryThumb} />
      <Card.Body>
        <Card.Title>{profile.title}</Card.Title>
        <Card.Text>{profile.jobTitle}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export const ProfileList = ({ profiles }) => (
  <Row>
    {profiles.map((profile) => (
      <Col className="mt-3" key={profile.id} xs={6} sm={6} md={4} lg={3} xl={2}>
        <ProfileListItem profile={profile} />
      </Col>
    ))}
  </Row>
)
