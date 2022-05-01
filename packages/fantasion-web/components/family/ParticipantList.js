import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import { capitalize } from '../../api'
import { CheckIcon } from '../icons'
import { DateLabel } from '../dates'
import { Link } from '../links'
import { Form, FormControls } from '../forms'
import { useState } from 'react'
import { Heading, Section } from '../media'
import { InteractiveButton } from '../buttons'
import { SearchInput } from '../search'
import { TextTooltip } from '../tooltips'
import { useFetch } from '../context'
import { UserName } from '../users'
import { useTranslation } from 'next-i18next'

const TraitProperty = ({ title, description }) => (
  <TextTooltip tip={description}>{title}</TextTooltip>
)

const TraitStats = ({ items, trait }) =>
  items
    .map((item) => item[trait])
    .reduce(
      (aggr, property, index) => [
        ...aggr,
        <TraitProperty {...property} key={property.id} />,
        index < items.length - 1 && ', ',
      ],
      []
    )
    .filter(Boolean)

const TraitZeroState = ({ onEdit, onSetNone, trait }) => {
  const [noneLoading, setNoneLoading] = useState(false)
  const { t } = useTranslation()
  const handleSetNone = async () => {
    setNoneLoading(true)
    try {
      await onSetNone()
    } finally {
      setNoneLoading(false)
    }
  }
  return (
    <>
      <InteractiveButton
        disabled={noneLoading}
        onClick={onEdit}
        variant="primary"
      >
        {t(`participant-trait-fill-in-${trait}`)}
      </InteractiveButton>
      <InteractiveButton
        className="ms-2"
        variant="secondary"
        onClick={handleSetNone}
      >
        {t(`participant-trait-has-no-${trait}`)}
      </InteractiveButton>
    </>
  )
}

const TraitForm = ({
  collection,
  items,
  onCancel,
  onSetNone,
  onSubmit,
  trait,
}) => {
  const { t } = useTranslation()
  const [disabled, setDisabled] = useState(false)
  const defaultValues = {
    [collection]: items.map((item) => item[trait]),
  }
  const handleSetNone = async () => {
    setDisabled(true)
    try {
      await onSetNone()
      onCancel()
    } finally {
      setDisabled(false)
    }
  }
  const handleSubmit = (values) => {
    const translated = values[collection].map(
      (v) =>
        items.find((i) => i[trait].title === v.title) || {
          [trait]: v,
        }
    )
    onSubmit({
      [collection]: translated,
    })
  }
  return (
    <Form
      defaultValues={defaultValues}
      id={`form-${trait}`}
      onSubmit={handleSubmit}
    >
      <SearchInput
        allowNew
        autoFocus
        collection={collection}
        disabled={disabled}
        label={t(`participant-${collection}`)}
        itemToString={(item) => item?.title}
        stringToOption={(title) => ({
          id: title,
          title: capitalize(title),
        })}
        multiple
        name={collection}
        required
      />
      <FormControls
        cancelLabel={t('cancel')}
        disabled={disabled}
        onCancel={onCancel}
        submitLabel={t('form-save')}
      >
        <InteractiveButton
          className="ms-2"
          variant="secondary"
          onClick={handleSetNone}
        >
          {t(`participant-trait-has-no-${trait}`)}
        </InteractiveButton>
      </FormControls>
    </Form>
  )
}

const TraitEmpty = ({ trait }) => {
  const { t } = useTranslation()
  return (
    <>
      <CheckIcon /> {t(`participant-trait-has-no-${trait}`)}
    </>
  )
}

const TraitStatus = ({ none, items, onEdit, onSetNone, trait }) => {
  if (none) {
    return <TraitEmpty trait={trait} />
  }
  if (items.length === 0) {
    return (
      <TraitZeroState onEdit={onEdit} onSetNone={onSetNone} trait={trait} />
    )
  }
  return <TraitStats items={items} trait={trait} />
}

const Trait = ({
  name,
  none,
  collection,
  onParticipantUpdate,
  participantId,
  items,
  trait,
}) => {
  const fetch = useFetch()
  const [edit, setEdit] = useState(false)
  const noneLabel = `no${capitalize(collection)}`
  const handleSetNone = async () => {
    onParticipantUpdate(
      await fetch.patch(`/participants/${participantId}`, {
        body: {
          [noneLabel]: true,
          [collection]: [],
        },
      })
    )
  }
  if (edit) {
    const handleSubmit = async (values) => {
      onParticipantUpdate(
        await fetch.patch(`/participants/${participantId}`, {
          body: {
            ...values,
            [noneLabel]: false,
          },
        })
      )
      setEdit(false)
    }
    return (
      <ListGroup.Item>
        <TraitForm
          collection={collection}
          items={items}
          onCancel={() => setEdit(false)}
          onSetNone={handleSetNone}
          onSubmit={handleSubmit}
          trait={trait}
        />
      </ListGroup.Item>
    )
  }
  const zeroState = !none && items.length === 0
  const handleEdit = () => setEdit(true)
  return (
    <ListGroup.Item action={!zeroState} onClick={zeroState ? null : handleEdit}>
      <strong>{name}</strong>:{' '}
      <div>
        <TraitStatus
          trait={trait}
          items={items}
          onEdit={handleEdit}
          onSetNone={handleSetNone}
          none={none}
        />
      </div>
    </ListGroup.Item>
  )
}

export const ParticipantListItem = ({
  allergies,
  birthdate,
  diets,
  hobbies,
  id,
  noAllergies,
  noDiets,
  noHobbies,
  onParticipantUpdate,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <Card as={Section}>
      <Card.Header>
        <Heading>
          <Link route="participantDetail" params={{ participantId: id }}>
            <UserName user={props} />
          </Link>
        </Heading>
        <div>
          <DateLabel date={birthdate} year="numeric" />
        </div>
      </Card.Header>
      <ListGroup variant="flush">
        <Trait
          name={t('participant-allergies')}
          items={allergies}
          participantId={id}
          none={noAllergies}
          onParticipantUpdate={onParticipantUpdate}
          collection="allergies"
          trait="allergy"
        />
        <Trait
          name={t('participant-diets')}
          participantId={id}
          items={diets}
          none={noDiets}
          onParticipantUpdate={onParticipantUpdate}
          collection="diets"
          trait="diet"
        />
        <Trait
          name={t('participant-hobbies')}
          items={hobbies}
          participantId={id}
          none={noHobbies}
          onParticipantUpdate={onParticipantUpdate}
          collection="hobbies"
          trait="hobby"
        />
      </ListGroup>
    </Card>
  )
}

export const ParticipantList = ({ onParticipantUpdate, results, ...props }) => (
  <Row {...props}>
    {results.map((participant) => (
      <Col key={participant.id} md={12} lg={6}>
        <ParticipantListItem
          {...participant}
          onParticipantUpdate={onParticipantUpdate}
        />
      </Col>
    ))}
  </Row>
)
