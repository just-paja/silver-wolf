import classnames from 'classnames'
import BsForm from 'react-bootstrap/Form'

import { FormProvider, useForm } from 'react-hook-form'
import { forwardRef, useCallback, useState } from 'react'
import { InteractiveButton } from './buttons'
import { useFormContext } from 'react-hook-form'

import styles from './forms.module.scss'

const ReflessControlledForm = ({ children, id, onSubmit, ...props }, ref) => (
  <BsForm id={id} onSubmit={onSubmit} ref={ref} {...props}>
    {children}
  </BsForm>
)

export const ControlledForm = forwardRef(ReflessControlledForm)

const ReflessForm = ({ defaultValues, children, id, onSubmit }, ref) => {
  const [processingError, setProcessingError] = useState(null)
  const methods = useForm({ defaultValues })
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
          if (e.body.field) {
            setError(e.body.field, e.body)
          }
          if (e.body.fieldErrors) {
            for (const fieldError of e.body.fieldErrors) {
              setError(fieldError.field, fieldError)
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
  if (type === 'select') {
    return 'select'
  }
  if (type === 'textarea') {
    return 'textarea'
  }
  return 'input'
}

const resolveComponent = (type) => {
  if (type === 'select') {
    return BsForm.Select
  }
  return BsForm.Control
}

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
  if (error.code === 'field-is-required') {
    return 'Field is required'
  }
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
  const as = resolveType(type)
  const Component = resolveComponent(as)
  const fieldError = error || formState.errors[name]
  const field = register(name, {
    required: required && 'Field is required',
    setValueAs: (v) => (['', undefined].includes(v) ? null : v),
    validate,
  })
  const handleChange = onChange
    ? getChangeWrapper(field, onChange)
    : field.onChange
  return (
    <BsForm.Group controlId={controlId} className="mt-2">
      {label ? <BsForm.Label>{label}</BsForm.Label> : null}
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
