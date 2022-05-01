import { capitalize } from '../../api'
import { Form, FormControls } from '../forms'
import { useState } from 'react'
import { InteractiveButton } from '../buttons'
import { SearchInput } from '../search'
import { useTranslation } from 'next-i18next'

export const TraitForm = ({
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
