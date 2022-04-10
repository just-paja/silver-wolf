import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Heading } from './media'
import { Link } from './links'
import { ProfileAvatar } from './profiles'
import { slug } from './slugs'
import { TroopCard } from './troops'
import { useTranslation } from 'next-i18next'

import styles from './batches.module.scss'

export const BatchTroops = ({ expedition, batch, troops }) => {
  return (
    <>
      {troops.map((troop) => (
        <Col md={6} lg={5} xl={4} key={troop.id} className="mt-3">
          <TroopCard
            expedition={expedition}
            batch={batch}
            key={troop.id}
            troop={troop}
          />
        </Col>
      ))}
    </>
  )
}

const Caretaker = ({ profile, role }) => {
  return (
    <Link
      className={styles.caretaker}
      route="profileDetail"
      params={{ profileSlug: slug(profile) }}
    >
      <div className={styles.avatar}>
        <ProfileAvatar avatar={profile.avatar} />
      </div>
      <div>
        <div className={styles.role}>{role.title}</div>
        <div className={styles.name}>{profile.title}</div>
        <div className={styles.title}>{profile.jobTitle}</div>
      </div>
    </Link>
  )
}

export const Team = ({ team }) => {
  const { t } = useTranslation()
  return (
    <section className="mt-3">
      <Heading relativeLevel={2}>{t('batch-team')}</Heading>
      <p>{t('batch-team-general-info')}</p>
      <Row className="mt-3">
        {team.map((caretaker) => (
          <Col key={caretaker.id} md={6} lg={4} xl={3}>
            <Caretaker profile={caretaker.profile} role={caretaker.role} />
          </Col>
        ))}
      </Row>
    </section>
  )
}
