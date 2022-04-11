import Alert from 'react-bootstrap/Alert'
import classnames from 'classnames'
import BsForm from 'react-bootstrap/Form'
import FormCheck from 'react-bootstrap/FormCheck'
import PhoneNumberInput from 'react-phone-input-2'

import { FormProvider, useForm } from 'react-hook-form'
import { forwardRef, useCallback, useState } from 'react'
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

export const Input = ({
  as,
  className,
  error,
  label,
  name,
  onChange,
  options,
  helpText,
  required,
  size = 'default',
  type,
  validate,
  value,
  ...props
}) => {
  const { formId, register, formState, watch } = useFormContext()
  const { t } = useTranslation()
  const rightLabel = isLabelRight(type)
  const controlId = `${formId}-${name}${rightLabel ? `-${value}` : null}`
  const htmlOptions = getOptions(options, required)
  const Component = resolveComponent(type, as)
  const fieldError = error || formState.errors[name]
  const currentValue = watch(name)
  const field = register(name, {
    setValueAs: (v) => (['', undefined].includes(v) ? null : v),
    validate,
  })
  const handleChange = onChange
    ? getChangeWrapper(field, onChange)
    : field.onChange
  return (
    <BsForm.Group
      controlId={controlId}
      className={classnames('mt-2', {
        'form-check': rightLabel,
      })}
    >
      {label && !rightLabel ? (
        <BsForm.Label className={required ? 'fw-bold' : ''}>
          {label}:
        </BsForm.Label>
      ) : null}
      <Component
        as={resolveType(type)}
        disabled={formState.isSubmitting}
        checked={
          type === 'radio' ? currentValue === value : Boolean(currentValue)
        }
        isInvalid={Boolean(fieldError)}
        name={name}
        type={type}
        value={type === 'checkbox' ? value || 'true' : value}
        {...props}
        {...field}
        className={classnames(styles[size], className)}
        onChange={handleChange}
      >
        {htmlOptions}
      </Component>
      {label && rightLabel ? (
        <BsForm.Label className="form-check-label">{label}</BsForm.Label>
      ) : null}
      {fieldError ? (
        <BsForm.Control.Feedback type="invalid">
          {describeError(t, fieldError)}
        </BsForm.Control.Feedback>
      ) : null}
      {helpText ? <BsForm.Text as="div">{helpText}</BsForm.Text> : null}
    </BsForm.Group>
  )
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
  onCancel,
  submitLabel,
}) => {
  const { t } = useTranslation()
  const { formState } = useFormContext()
  return (
    <>
      <FormError vague />
      <div className="mt-3">
        {onCancel && (
          <InteractiveButton
            className="me-2"
            type="button"
            variant="warning"
            onClick={onCancel}
          >
            {cancelLabel || t('cancel')}
          </InteractiveButton>
        )}
        <Submit inProgress={formState.isSubmitting}>{submitLabel}</Submit>
        {children}
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
    <BsForm.Group>
      {label && (
        <BsForm.Label className={required ? 'fw-bold' : ''}>
          {label}:
        </BsForm.Label>
      )}
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
