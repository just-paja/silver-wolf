import classnames from 'classnames'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { ArticleStub } from './articles'
import { DateTimeLabel, getDaysDuration } from './dates'
import { Heading, Section } from './media'
import { PriceTag } from './money'
import { SignupButton } from './expeditions'
import { useTranslation } from 'next-i18next'
import { Link } from './links'
import {
  TRANSPORT_THERE,
  TRANSPORT_BACK,
  TRANSPORT_DEPARTED,
  TRANSPORT_ARRIVED,
} from './constants'
import {
  BusDepartureIcon,
  DurationIcon,
  IconLabel,
  PersonIcon,
  StoryIcon,
} from './icons'

import styles from './troops.module.scss'

export const isPriceAvailable = (price) => price.active

export const isTroopAvailable = (troop) => troop.prices.some(isPriceAvailable)

export const TroopLabel = ({ ageMin, ageMax, startsAt, endsAt }) => {
  const { t } = useTranslation()
  return (
    <IconLabel
      icon={PersonIcon}
      text={`${t('age-limit', { ageMin, ageMax })}, ${t('expedition-length', {
        daysLength: getDaysDuration(startsAt, endsAt),
      })}`}
    />
  )
}

const TroopTransportLinkLabel = ({ direction, transport }) => {
  const { t } = useTranslation()
  if (transport.status === TRANSPORT_DEPARTED) {
    return t('transport-en-route')
  }
  if (transport.status === TRANSPORT_ARRIVED) {
    return t('transport-arrived')
  }
  const dest =
    direction === TRANSPORT_BACK ? transport.arrivesTo : transport.departsFrom
  const date =
    direction === TRANSPORT_BACK ? transport.arrivesAt : transport.departsAt
  if (date) {
    return (
      <>
        {dest.name} (
        <DateTimeLabel date={date} />)
      </>
    )
  }
  return dest.name
}

const TroopTransportDirection = ({ direction }) => {
  const { t } = useTranslation()
  if (direction === TRANSPORT_THERE) {
    return `${t('transport-there')}: `
  }
  if (direction === TRANSPORT_BACK) {
    return `${t('transport-back')}: `
  }
  return null
}

const TroopTransportLink = ({ troopTransport }) => (
  <Link
    route="transportDetail"
    params={{ transportId: troopTransport.transport.id }}
  >
    <TroopTransportDirection direction={troopTransport.direction} />
    <TroopTransportLinkLabel
      direction={troopTransport.direction}
      transport={troopTransport.transport}
    />
  </Link>
)

export const TroopCard = ({ expedition, batch, troop }) => {
  const { t } = useTranslation()
  return (
    <Section component={Card}>
      <Card.Header>
        <Heading className="mt-2">{troop.ageGroup.title}</Heading>
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <IconLabel
            icon={PersonIcon}
            text={t('age-limit', {
              ageMin: troop.ageGroup.ageMin,
              ageMax: troop.ageGroup.ageMax,
            })}
          />
        </ListGroup.Item>
        <ListGroup.Item>
          <IconLabel
            icon={DurationIcon}
            text={t('expedition-length', {
              daysLength: getDaysDuration(troop.startsAt, troop.endsAt),
            })}
          />
        </ListGroup.Item>
        <ListGroup.Item>
          <IconLabel icon={StoryIcon} text={troop.program.title} />
        </ListGroup.Item>
        {troop.troopTransports.map((tt) => (
          <ListGroup.Item key={tt.id}>
            <IconLabel
              icon={BusDepartureIcon}
              text={<TroopTransportLink troopTransport={tt} />}
            />
          </ListGroup.Item>
        ))}
        <ListGroup.Item>
          <ul className="mb-0">
            {troop.prices.map((price) => (
              <li key={price.id}>
                <PriceTag {...price} />
              </li>
            ))}
          </ul>
        </ListGroup.Item>
        {troop.priceIncludes && (
          <ListGroup.Item>
            <ArticleStub
              className={classnames('mt-3', styles.priceIncludes)}
              heading={t('signup-troop-price-includes')}
              text={troop.priceIncludes}
            />
          </ListGroup.Item>
        )}
      </ListGroup>
      {isTroopAvailable(troop) ? (
        <Card.Body>
          <SignupButton expedition={expedition} batch={batch} troop={troop} />
        </Card.Body>
      ) : null}
    </Section>
  )
}
