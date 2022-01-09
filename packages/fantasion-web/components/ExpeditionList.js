import Card from 'react-bootstrap/Card'

const Expedition = ({ expedition }) => {
  return (
    <Card className="mt-1">
      <Card.Body>
        <Card.Title>{expedition.title}</Card.Title>
        <Card.Text>{expedition.description}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export const ExpeditionList = ({ expeditions }) => {
  return expeditions.results.map((expedition) => (
    <Expedition expedition={expedition} key={expedition.id} />
  ))
}
