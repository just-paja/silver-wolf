import classnames from 'classnames'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { ArticleStub } from './articles'
import { DurationIcon, IconLabel, PersonIcon, StoryIcon } from './icons'
import { getDaysDuration } from './dates'
import { Heading, Section } from './media'
import { PriceTag } from './money'
import { SignupButton } from './expeditions'
import { useTranslation } from 'next-i18next'

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
