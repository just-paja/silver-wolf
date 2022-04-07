import Accordion from 'react-bootstrap/Accordion'
import moment from 'moment'
import React from 'react'

import { useFormContext } from 'react-hook-form'
import { formatDateRange } from './dates'
import { Form, FormControls, Input } from './forms'
import { useExpedition } from './expeditions'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

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

const ParticipantSelectionInput = (props) => {
  const { t } = useTranslation()
  return (
    <Input
      {...props}
      label={t('input-participant')}
      options={[]}
      required
      type="select"
    />
  )
}

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
      disabled={!troop}
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

export const ParticipantForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  const defaultValues = {}
  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
      <GivenNameInput name="firstName" required />
      <FamilyNameInput name="lastName" required />
      <DateOfBirthInput name="dateOfBirth" required />
      <FormControls submitLabel={t('input-save-participant')} />
    </Form>
  )
}

const familyParticipantQuery = selectorFamily({
  key: 'family:participants:query',
  get: (familyId) => () => fetch(`/participants?familyId=${familyId}`),
})

const familyParticipants = atomFamily({
  key: 'family:participants',
  default: familyParticipantQuery,
})

export const ParticipantSelection = ({ onSubmit }) => {
  const participants = useRecoilValue(familyParticipants())
  console.log(participants)
  return null
}

export const SignupForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  const { batches } = useExpedition()
  const defaultValues = {
    batchId: batches[0]?.id,
    batchAgeGroupId: batches[0]?.troops[0]?.id,
  }
  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
      <ParticipantSelectionInput name="participantId" required />
      <BatchSelection name="batchId" required />
      <TroopSelection name="batchAgeGroupId" required />
      <NoteInput name="note" />
      <FormControls submitLabel={t('input-save-signup')} />
    </Form>
  )
}

export const SignupWizzard = ({}) => {
  const [activeKey, setActiveKey] = useState(1)
  const { t } = useTranslation()

  return (
    <Accordion activeKey={activeKey} alwaysOpen>
      <Accordion.Item eventKey={1}>
        <Accordion.Header onClick={() => setActiveKey(1)}>
          {t('signup-participant-selection')}
        </Accordion.Header>
        <Accordion.Body>
          <ParticipantSelection />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey={2}>
        <Accordion.Header onClick={() => setActiveKey(2)}>
          {t('signup-participant-selection')}
        </Accordion.Header>
        <Accordion.Body>
          <SignupForm onSubmit={(values) => console.log(values)} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
