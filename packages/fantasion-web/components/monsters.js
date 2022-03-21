import classnames from 'classnames'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'

import { Article } from './articles'
import { Linker } from './links'
import { slug } from './slugs'

import styles from './monsters.module.scss'

const NoAvatar = ({ className }) => (
  <div
    className={classnames('p-4 text-secondary bg-secondary', className)}
  ></div>
)

export const MonsterAvatar = ({
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

const MonsterListItem = ({ monster }) => {
  return (
    <Linker route="monsterDetail" params={{ monsterSlug: slug(monster) }}>
      <Card as="a">
        <MonsterAvatar avatar={monster.avatar} />
        <Card.Body>
          <Card.Title>{monster.title}</Card.Title>
          <Card.Text>
            <i>{monster.description}</i>
          </Card.Text>
        </Card.Body>
      </Card>
    </Linker>
  )
}

export const MonsterList = ({ monsters }) => (
  <Row>
    {monsters.map((monster) => (
      <Col className="mt-3" key={monster.id} xs={6} sm={6} md={4} lg={3} xl={2}>
        <MonsterListItem monster={monster} />
      </Col>
    ))}
  </Row>
)

export const MonsterDetail = ({ monster }) => (
  <Article
    title={monster.title}
    description={monster.description}
    media={monster.media}
    text={monster.text}
  />
)
