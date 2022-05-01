import Alert from 'react-bootstrap/Alert'
import classnames from 'classnames'
import BsForm from 'react-bootstrap/Form'
import FormCheck from 'react-bootstrap/FormCheck'
import PhoneNumberInput from 'react-phone-input-2'

import { FormProvider, useForm } from 'react-hook-form'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { InteractiveButton } from './buttons'
import { object, setLocale } from 'yup'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'

import styles from './forms.module.scss'

const ReflessControlledForm = ({ children, id, onSubmit, ...props }, ref) => (
  <BsForm noValidate id={id} onSubmit={onSubmit} ref={ref} {...props}>
    {children}
  </BsForm>
)

export const ControlledForm = forwardRef(ReflessControlledForm)

const ReflessForm = (
  { defaultValues, children, id, onSubmit, resolver, ...props },
  ref
) => {
  const [processingError, setProcessingError] = useState(null)
  const methods = useForm({ defaultValues, resolver })
  const { handleSubmit, setError } = methods
  const protectedSubmit = useCallback(
    async (values) => {
      try {
        setProcessingError(null)
        return await onSubmit(values)
      } catch (e) {
        setProcessingError(e)
        // @FIXME This error should be reported to Sentry
        console.error(e)
        if (e.body) {
          const formErrors = Object.entries(e.body).filter(
            ([key]) => key !== 'nonFieldErrors'
          )
          for (const [field, fieldErrors] of formErrors) {
            for (const fieldError of fieldErrors) {
              setError(field, { message: fieldError })
            }
          }
        }
      }
    },
    [onSubmit, setError, setProcessingError]
  )
  return (
    <FormProvider formId={id} processingError={processingError} {...methods}>
      <ControlledForm
        {...props}
        id={id}
        onSubmit={handleSubmit(protectedSubmit)}
        ref={ref}
      >
        {children}
      </ControlledForm>
    </FormProvider>
  )
}

export const Form = forwardRef(ReflessForm)

const resolveType = (type) => {
  if (type === 'checkbox') {
    return
  }
  if (type === 'select') {
    return 'select'
  }
  if (type === 'textarea') {
    return 'textarea'
  }
  return 'input'
}

const resolveComponent = (type, as) => {
  if (as) {
    return as
  }
  if (type === 'checkbox' || type === 'radio') {
    return FormCheck.Input
  }
  if (type === 'select') {
    return BsForm.Select
  }
  return BsForm.Control
}

const rightLabelMap = ['checkbox', 'radio']

const isLabelRight = (type) => rightLabelMap.includes(type)

const getOptions = (options, required) => {
  let opts = null
  if (options) {
    opts = options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))

    if (!required) {
      opts.unshift(
        <option value="" key={null}>
          - - -
        </option>
      )
    }
  }
  return opts
}

const describeError = (t, error) => {
  if (error.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error.type) {
    return t(`error-input-${error.type}`)
  }
  return t('error-unknown')
}

const getChangeWrapper = (field, onChange) => (e) => {
  onChange(e)
  field.onChange(e)
}

export const FormLabel = ({ colon = true, formCheck, required, text }) => (
  <BsForm.Label
    className={classnames(styles.label, {
      'form-check-label': formCheck,
      'fw-bold': required,
    })}
  >
    {text}
    {colon ? ':' : ''}
  </BsForm.Label>
)

export const FormlessInput = forwardRef(function InnerForlessInput(
  {
    as,
    className,
    error,
    id,
    label,
    name,
    options,
    helpText,
    required,
    size = 'default',
    type,
    ...props
  },
  ref
) {
  const { formId, formState, watch } = useFormContext()
  const { t } = useTranslation()
  const rightLabel = isLabelRight(type)
  const controlId =
    id || `${formId}-${name}${rightLabel ? `-${props.value}` : ''}`
  const htmlOptions = getOptions(options, required)
  const Component = resolveComponent(type, as)
  const fieldError = error || formState.errors[name]
  const currentValue = watch(name)
  const inputProps = {}
  if (type === 'checkbox') {
    inputProps.value = props.value || 'true'
  }
  if (type === 'radio') {
    inputProps.checked = currentValue === props.value
    inputProps.value = props.value
  }
  return (
    <BsForm.Group
      controlId={controlId}
      className={classnames('mt-2', {
        'form-check': rightLabel,
      })}
    >
      {label && !rightLabel ? (
        <FormLabel required={required} text={label} />
      ) : null}
      <Component
        as={resolveType(type)}
        disabled={formState.isSubmitting}
        isInvalid={Boolean(fieldError)}
        name={name}
        type={type}
        {...inputProps}
        {...props}
        className={classnames(styles[size], className)}
        ref={ref}
      >
        {htmlOptions}
      </Component>
      {label && rightLabel ? (
        <FormLabel colon={false} text={label} required={required} formCheck />
      ) : null}
      {fieldError ? (
        <BsForm.Control.Feedback type="invalid">
          {describeError(t, fieldError)}
        </BsForm.Control.Feedback>
      ) : null}
      {helpText ? <BsForm.Text as="div">{helpText}</BsForm.Text> : null}
    </BsForm.Group>
  )
})

export const Input = ({ name, onChange, validate, ...props }) => {
  const { register } = useFormContext()
  const field = register(name, {
    setValueAs: (v) => (['', undefined].includes(v) ? null : v),
    validate,
  })
  const handleChange = onChange
    ? getChangeWrapper(field, onChange)
    : field.onChange
  return <FormlessInput {...props} {...field} onChange={handleChange} />
}

export const Submit = ({ children, ...props }) => (
  <InteractiveButton {...props} type="submit">
    {children}
  </InteractiveButton>
)

const desecribeProcessingError = (t, err) => {
  if (err?.body?.nonFieldErrors) {
    return err.body.nonFieldErrors.join(',')
  }
  if (err?.body?.message) {
    return err.body.message
  }
  return t('form-failed-to-submit')
}

export const FormError = ({ vague }) => {
  const { processingError } = useFormContext()
  const { t } = useTranslation()
  if (processingError) {
    return (
      <div className="mt-3">
        <Alert variant="danger">
          {vague
            ? t('form-failed-to-submit')
            : desecribeProcessingError(t, processingError)}
        </Alert>
      </div>
    )
  }
  return null
}

export const FormControls = ({
  cancelLabel,
  children,
  disabled,
  onCancel,
  size,
  submitLabel,
}) => {
  const { t } = useTranslation()
  const { formState } = useFormContext()
  return (
    <>
      <FormError vague />
      <div className="mt-3">
        <Submit
          disabled={disabled}
          inProgress={formState.isSubmitting}
          size={size}
        >
          {submitLabel}
        </Submit>
        {children}
        {onCancel && (
          <InteractiveButton
            className="ms-2"
            disabled={disabled}
            type="button"
            variant="secondary"
            size={size}
            onClick={onCancel}
          >
            {cancelLabel || t('cancel')}
          </InteractiveButton>
        )}
      </div>
    </>
  )
}

export const useValidator = (shape) => {
  const { t } = useTranslation()
  setLocale({
    boolean: {
      required: t('form-input-required'),
    },
    mixed: {
      required: t('form-input-required'),
    },
    number: {
      required: t('form-input-required'),
    },
    object: {
      required: t('form-input-required'),
    },
    string: {
      email: t('form-input-email'),
      min: t('form-input-min-length'),
      max: t('form-input-max-length'),
      required: t('form-input-required'),
    },
  })
  return yupResolver(object().shape(shape))
}

export const PhoneInput = ({ name, label, helpText, required, ...props }) => {
  const { setValue, register, formState } = useFormContext()
  const { t } = useTranslation()
  const fieldError = formState.errors[name]
  const field = register(name)
  const handleChange = (value) => {
    setValue(name, `+${value}`)
  }
  return (
    <BsForm.Group className="mt-2">
      {label && <FormLabel required={required} text={label} />}
      <PhoneNumberInput
        {...props}
        autocompleteSearch
        className={classnames('form-control', 'd-flex', styles.phoneInput, {
          'is-invalid': Boolean(fieldError),
        })}
        country="cz"
        name={name}
        prefix="+"
        {...field}
        onChange={handleChange}
      />
      {fieldError ? (
        <BsForm.Control.Feedback type="invalid">
          {describeError(t, fieldError)}
        </BsForm.Control.Feedback>
      ) : null}
      {helpText ? <BsForm.Text as="div">{helpText}</BsForm.Text> : null}
    </BsForm.Group>
  )
}

const shallowCompare = (obj1, obj2) => {
  for (const key in obj2) {
    if (obj2[key] !== obj1[key]) {
      return false
    }
  }
  return true
}

const AutosaveAgent = ({ defaultValues, onSubmit }) => {
  const { handleSubmit, watch } = useFormContext()
  const value = useRef(defaultValues)
  const newData = watch()
  const changed = !shallowCompare(value.current, newData)
  const triggerSubmit = handleSubmit(onSubmit)
  useEffect(() => {
    if (changed) {
      value.current = newData
      triggerSubmit(newData)
    }
  }, [changed, newData, triggerSubmit])
  return null
}

export const AutosaveForm = ({
  children,
  defaultValues,
  onSubmit,
  ...props
}) => {
  return (
    <Form {...props} defaultValues={defaultValues} onSubmit={onSubmit}>
      <AutosaveAgent defaultValues={defaultValues} onSubmit={onSubmit} />
      {children}
    </Form>
  )
}
