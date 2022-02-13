import classnames from 'classnames'
import BsForm from 'react-bootstrap/Form'
import FormCheck from 'react-bootstrap/FormCheck'

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
  { defaultValues, children, id, onSubmit, resolver },
  ref
) => {
  const [processingError, setProcessingError] = useState(null)
  const methods = useForm({ defaultValues, resolver })
  const { handleSubmit, setError } = methods
  const protectedSubmit = useCallback(
    async (values) => {
      try {
        setProcessingError(null)
        await onSubmit(values)
      } catch (e) {
        setProcessingError(e)
        // @FIXME This error should be reported to Sentry
        console.error(e)
        if (e.body) {
          for (const [field, fieldErrors] of Object.entries(e.body)) {
            for (const fieldError of fieldErrors) {
              setError(field, { message: fieldError })
            }
          }
        }
      }
    },
    [onSubmit, setError]
  )

  return (
    <FormProvider formId={id} processingError={processingError} {...methods}>
      <ControlledForm
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
  if (type === 'checkbox') {
    return FormCheck.Input
  }
  if (type === 'select') {
    return BsForm.Select
  }
  return BsForm.Control
}

const rightLabelMap = ['checkbox']

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

const describeError = (error) => {
  if (error.message) {
    return error.message
  }
  return error
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
  ...props
}) => {
  const { formId, register, formState } = useFormContext()
  const controlId = `${formId}-${name}`
  const htmlOptions = getOptions(options, required)
  const Component = resolveComponent(type, as)
  const rightLabel = isLabelRight(type)
  const fieldError = error || formState.errors[name]
  const field = register(name, {
    required: required,
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
      {label && !rightLabel ? <BsForm.Label>{label}</BsForm.Label> : null}
      <Component
        as={resolveType(type)}
        type={type}
        name={name}
        disabled={formState.isSubmitting}
        isInvalid={Boolean(fieldError)}
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
          {describeError(fieldError)}
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

export const FormControls = ({ submitLabel }) => {
  const { formState } = useFormContext()
  return (
    <div className="mt-3">
      <Submit inProgress={formState.isSubmitting}>{submitLabel}</Submit>
    </div>
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
