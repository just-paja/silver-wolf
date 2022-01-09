import Card from 'react-bootstrap/Card'

import { DateRange } from './dates'
import { Article } from './media'

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
        <Card.Text>
          <Article text={expedition.description} media={expedition.media} />
        </Card.Text>
        {expedition.batches.map((batch) => (
          <ExpeditionBatch key={batch.id} batch={batch} />
        ))}
      </Card.Body>
    </Card>
  )
}

export const ExpeditionList = ({ expeditions }) => {
  return expeditions.results.map((expedition) => (
    <Expedition expedition={expedition} key={expedition.id} />
  ))
}
