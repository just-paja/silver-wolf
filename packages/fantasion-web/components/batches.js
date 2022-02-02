import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Heading } from './media'
import { Link } from './links'
import { ProfileAvatar } from './profiles'
import { slug } from './slugs'
import { TroopLabel } from './troops'
import { useTranslation } from 'next-i18next'

import styles from './batches.module.scss'

export const BatchTroops = ({ troops }) => {
  const { t } = useTranslation()
  return (
    <section className="mt-3">
      <Heading relativeLevel={2}>{t('batch-troops')}</Heading>
      {troops.map((troop) => (
        <TroopLabel
          ageMax={troop.ageGroup.ageMax}
          ageMin={troop.ageGroup.ageMin}
          endsAt={troop.endsAt}
          key={troop.id}
          startsAt={troop.startsAt}
        />
      ))}
    </section>
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
