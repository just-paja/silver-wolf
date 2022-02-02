import classnames from 'classnames'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'

import { Article } from './articles'
import { Linker } from './links'
import { slug } from './slugs'
import { SiteLogo } from './SiteLogo'

import styles from './profiles.module.scss'

const NoAvatar = ({ className }) => (
  <div className={classnames('p-4 text-secondary bg-primary', className)}>
    <SiteLogo />
  </div>
)

export const ProfileAvatar = ({
  as: Component = 'img',
  avatar,
  className,
  ...props
}) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), Math.random() * 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={styles.avatar}>
      <div className={styles.square}>
        <NoAvatar className={styles.noAvatar} />
        {avatar ? (
          <Component
            src={avatar.galleryThumb}
            {...props}
            className={classnames(styles.realAvatar, className, {
              [styles.visibleAvatar]: show,
            })}
          />
        ) : null}
      </div>
    </div>
  )
}

const ProfileListItem = ({ profile }) => {
  return (
    <Linker route="profileDetail" params={{ profileSlug: slug(profile) }}>
      <Card as="a">
        <ProfileAvatar avatar={profile.avatar} />
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
