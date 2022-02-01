import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { Article } from './articles'
import { Linker } from './links'
import { slug } from './slugs'
import { SiteLogo } from './SiteLogo'

const NoAvatar = () => (
  <div className="p-4 text-secondary bg-primary">
    <SiteLogo />
  </div>
)

const ProfileListItem = ({ profile }) => {
  return (
    <Linker route="profileDetail" params={{ profileSlug: slug(profile) }}>
      <Card as="a">
        {profile.avatar ? (
          <Card.Img variant="top" src={profile.avatar.galleryThumb} />
        ) : (
          <NoAvatar />
        )}
        <Card.Body>
          <Card.Title>{profile.title}</Card.Title>
          <Card.Text>{profile.jobTitle}</Card.Text>
        </Card.Body>
      </Card>
    </Linker>
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

export const ProfileDetail = ({ profile }) => (
  <Article
    description={profile.description}
    media={profile.media}
    subTitle={profile.jobTitle}
    text={profile.text}
    title={profile.title}
  />
)
