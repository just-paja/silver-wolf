import Card from 'react-bootstrap/Card'

import { Article } from './media'
import { DateRange } from './dates'

const LeisureCentreSummary = ({ leisureCentre }) => {
  return (
    <Article
      level={6}
      title={leisureCentre.title}
      text={leisureCentre.description}
      media={leisureCentre.media}
    />
  )
}

const ExpeditionBatch = ({ batch }) => {
  return (
    <div>
      <DateRange start={batch.startsAt} end={batch.endsAt} />
      {batch.leisureCentre ? (
        <LeisureCentreSummary leisureCentre={batch.leisureCentre} />
      ) : null}
    </div>
  )
}

const Expedition = ({ expedition }) => {
  return (
    <Card className="mt-1">
      <Card.Body>
        <Card.Title>{expedition.title}</Card.Title>
        <Card.Body>
          <Article text={expedition.description} media={expedition.media} />
        </Card.Body>
        {expedition.batches.map((batch) => (
          <ExpeditionBatch key={batch.id} batch={batch} />
        ))}
      </Card.Body>
    </Card>
  )
}

// @TODO: Design expeditions empty state
const NoExpeditions = () => null

export const ExpeditionList = ({ expeditions }) => {
  if (expeditions.results.length === 0) {
    return <NoExpeditions />
  }
  return expeditions.results.map((expedition) => (
    <Expedition expedition={expedition} key={expedition.id} />
  ))
}
