import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

export const InteractiveButton = ({
  children,
  disabled,
  inProgress,
  ...props
}) => {
  return (
    <Button {...props} disabled={disabled || inProgress}>
      {inProgress ? (
        <Spinner
          animation="border"
          aria-hidden="true"
          as="span"
          className="me-2"
          role="status"
          size="sm"
        />
      ) : null}
      {children}
    </Button>
  )
}
