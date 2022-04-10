import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import moment from 'moment'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { bool } from 'yup'
import { CancelIcon } from './icons'
import { DateRange, formatDateRange } from './dates'
import { Form, FormControls, Input, useValidator } from './forms'
import { InteractiveButton } from './buttons'
import { Money } from './money'
import { useActiveOrder, useExpedition, useFetch } from './context'
import { useFormContext } from 'react-hook-form'
import { UserName } from './users'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

const BatchSelection = (props) => {
  const { i18n, t } = useTranslation()
  const { batches } = useExpedition()
  const options = batches
    .filter((batch) => batch.troops.length !== 0)
    .map((batch) => ({
      label: formatDateRange(i18n.lang, batch.startsAt, batch.endsAt),
      value: batch.id,
    }))
  return (
    <Input
      {...props}
      label={t('input-expedition-batch')}
      type="select"
      options={options}
    />
  )
}

const formatTroopLabel = (troop) =>
  `${troop.ageGroup.title} (${troop.ageGroup.ageMin} - ${troop.ageGroup.ageMax} let)`

const useBatch = () => {
  const { batches } = useExpedition()
  const { watch } = useFormContext()
  const batchId = watch('batchId')
  return batches.find((b) => b.id === parseInt(batchId, 10))
}

const useTroop = () => {
  const { watch } = useFormContext()
  const batch = useBatch()
  const troopId = watch('batchAgeGroupId')
  return batch ? batch.troops.find((t) => t.id === parseInt(troopId, 10)) : null
}

const TroopSelection = (props) => {
  const { t } = useTranslation()
  const batch = useBatch()
  const options = batch
    ? batch.troops.map((troop) => ({
        label: formatTroopLabel(troop),
        value: troop.id,
      }))
    : []
  return (
    <Input
      {...props}
      disabled={!batch}
      label={t('input-age-group')}
      options={options}
      required
      type="select"
    />
  )
}

const GivenNameInput = (props) => (
  <Input
    {...props}
    type="text"
    label={useTranslation().t('input-given-name')}
  />
)

const FamilyNameInput = (props) => (
  <Input
    {...props}
    type="text"
    label={useTranslation().t('input-family-name')}
  />
)

const DateOfBirthInput = (props) => {
  const { t } = useTranslation()
  const troop = useTroop()
  const max =
    troop && moment(troop.startsAt).add(-1 * troop.ageGroup.ageMin, 'years')
  const min =
    troop && moment(troop.endsAt).add(-1 * troop.ageGroup.ageMax, 'years')
  return (
    <Input
      {...props}
      min={min}
      max={max}
      type="date"
      label={t('input-date-of-birth')}
    />
  )
}

const NoteInput = (props) => {
  const { t } = useTranslation()
  return <Input {...props} type="textarea" label={t('input-note')} />
}

export const ParticipantForm = () => {
  const { watch } = useFormContext()
  const participantId = watch('participantId')
  if (participantId) {
    return null
  }
  return (
    <>
      <GivenNameInput name="firstName" required />
      <FamilyNameInput name="lastName" required />
      <DateOfBirthInput name="birthdate" required />
    </>
  )
}

const ParticipantSelectionControls = ({ onCancel }) => {
  const { t } = useTranslation()
  const { watch } = useFormContext()
  const participantId = watch('participantId')
  return (
    <FormControls
      onCancel={onCancel}
      submitLabel={t(
        participantId ? 'signup-next' : 'signup-create-participant'
      )}
    />
  )
}

export const ParticipantSelection = ({
  participants,
  onAddParticipant,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation()
  const fetch = useFetch()

  const validator = useValidator({
    legalGuardian: bool().oneOf([true], t('form-input-required')),
  })
  const defaultValues = {
    participantId: participants[0]?.id || '',
  }

  const handleSubmit = async (values) => {
    const participant = participants.find(
      (p) => p.id === parseInt(values.participantId, 10)
    )
    if (participant) {
      onSubmit(participant)
    } else {
      const newParticipant = await fetch.post('/participants', {
        body: {
          birthdate: values.birthdate,
          firstName: values.firstName,
          lastName: values.lastName,
        },
      })
      onAddParticipant(newParticipant)
      onSubmit(newParticipant)
    }
  }

  return (
    <Form
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      resolver={validator}
    >
      {participants.map((participant) => (
        <Input
          type="radio"
          name="participantId"
          value={String(participant.id)}
          key={participant.id}
          label={<UserName user={participant} />}
        />
      ))}
      <Input
        type="radio"
        name="participantId"
        value=""
        label={t('signup-new-participant')}
      />
      <ParticipantForm />
      <Input
        type="checkbox"
        name="legalGuardian"
        label={t('signup-is-legal-guardian')}
        required
      />
      <ParticipantSelectionControls onCancel={onCancel} />
    </Form>
  )
}

export const SignupForm = ({ onCancel, onSubmit }) => {
  const { t } = useTranslation()
  const { batches } = useExpedition()
  const defaultValues = {
    batchId: batches[0]?.id,
    troopId: batches[0]?.troops[0]?.id,
    legalGuardian: true,
  }
  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
      <BatchSelection name="batchId" required />
      <TroopSelection name="troopId" required />
      <NoteInput name="note" />
      <p className="mt-3 text-muted">{t('signup-will-be-added')}</p>
      <FormControls onCancel={onCancel} submitLabel={t('input-save-signup')} />
    </Form>
  )
}

export const SignupWizzard = ({
  participants,
  onAddParticipant,
  onCancel,
  onSubmit,
  ...props
}) => {
  const [participantId, setParticipantId] = useState(null)
  const [activeKey, setActiveKey] = useState(1)
  const { t } = useTranslation()
  const selectParticipant = (participant) => {
    setParticipantId(participant.id)
    setActiveKey(2)
  }
  const handleSubmit = (values) => {
    return onSubmit({
      ...values,
      participantId,
    })
  }

  return (
    <Accordion {...props} activeKey={activeKey} alwaysOpen>
      <Accordion.Item eventKey={1}>
        <Accordion.Header onClick={() => setActiveKey(1)}>
          {t('signup-participant-selection')}
        </Accordion.Header>
        <Accordion.Body>
          <ParticipantSelection
            onAddParticipant={onAddParticipant}
            onCancel={onCancel}
            onSubmit={selectParticipant}
            participants={participants}
          />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey={2}>
        <Accordion.Header>{t('signup-troop-selection')}</Accordion.Header>
        <Accordion.Body>
          <SignupForm
            onCancel={onCancel}
            onSubmit={handleSubmit}
            participantId={participantId}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

const OrderSignup = ({ onCancel, signup }) => {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <Card.Title className="mb-0">
          <UserName user={signup.participant} />
        </Card.Title>
        {onCancel && (
          <InteractiveButton
            onClick={() => onCancel(signup)}
            variant="link"
            icon={CancelIcon}
          />
        )}
      </Card.Header>

      <ListGroup variant="flush">
        <ListGroup.Item>
          {signup.troop.batch.expedition.title}: {signup.troop.ageGroup.title}
        </ListGroup.Item>
        <ListGroup.Item>
          <DateRange start={signup.troop.startsAt} end={signup.troop.endsAt} />
        </ListGroup.Item>
        <ListGroup.Item>
          <Money amount={signup.price} />
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export const OrderSignups = ({ onCancelSignup, signups }) => (
  <Row>
    {signups.map((signup) => (
      <Col key={signup.id} xl={2} lg={3} md={4} sm={6} className="mt-3">
        <OrderSignup onCancel={onCancelSignup} signup={signup} />
      </Col>
    ))}
  </Row>
)

export const SignupDialog = ({
  expedition,
  participants,
  onAddParticipant,
  onCancel,
  onCreateSignup,
  onHide,
  show,
}) => {
  const { t } = useTranslation()
  const order = useActiveOrder()
  const unusedParticipants = participants.filter(
    (p) => !order.items.some((s) => s.participant.id === p.id)
  )
  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={onHide}>
        {t('expedition-signup-on', { expeditionTitle: expedition.title })}
      </Modal.Header>
      <Modal.Body>
        <SignupWizzard
          className="mt-3"
          participants={unusedParticipants}
          onCancel={onCancel}
          onSubmit={onCreateSignup}
          onAddParticipant={onAddParticipant}
        />
      </Modal.Body>
    </Modal>
  )
}
