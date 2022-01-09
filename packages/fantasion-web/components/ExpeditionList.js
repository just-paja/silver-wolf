import Card from 'react-bootstrap/Card'

const Expedition = ({ expedition }) => {
  return (
    <Card>
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
