import Alert from 'react-bootstrap/Alert'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Container from 'react-bootstrap/Container'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'

import { AlertContext, ToastContext, useAlerts } from './context'
import { InteractiveButton } from './buttons'
import { Link } from './links'
import { useCallback, useState } from 'react'
import { v4 } from 'uuid'

const useEntityCollection = () => {
  const [items, setItems] = useState([])
  const add = useCallback(
    (item) => setItems([...items, { ...item, id: v4() }]),
    [items, setItems]
  )
  const remove = useCallback(
    (itemId) => setItems(items.filter((item) => item.id !== itemId)),
    [items, setItems]
  )
  return { add, empty: items.length === 0, remove, items }
}

export const AlertProvider = ({ children }) => {
  const alerts = useEntityCollection()
  const toasts = useEntityCollection()
  return (
    <ToastContext.Provider value={toasts}>
      <AlertContext.Provider value={alerts}>{children}</AlertContext.Provider>
      <Toasts remove={toasts.remove} toasts={toasts.items} />
    </ToastContext.Provider>
  )
}

const ToastAction = ({ message, route }) => (
  <Link as={InteractiveButton} route={route} variant="link">
    {message}
  </Link>
)

const ToastActions = ({ actions }) => (
  <ButtonGroup style={{ width: '100%' }}>
    {actions.map((action) => (
      <ToastAction {...action} key={action.message} />
    ))}
  </ButtonGroup>
)

const Toasts = ({ remove, toasts }) => (
  <ToastContainer position="bottom-center" className="position-fixed">
    {toasts.map(({ actions, id, message, subject }) => (
      <Toast key={id} onClose={() => remove(id)}>
        <Toast.Header closeButton>
          <strong className="me-auto">{subject}</strong>
        </Toast.Header>
        {message && <Toast.Body>{message}</Toast.Body>}
        {actions && <ToastActions actions={actions} />}
      </Toast>
    ))}
  </ToastContainer>
)

export const Alerts = () => {
  const { empty, items, remove } = useAlerts()
  if (empty) {
    return null
  }
  return (
    <Container>
      {items.map((alert) => (
        <Alert
          className="m-auto mb-4"
          key={alert.id}
          onClose={() => remove(alert.id)}
          variant={alert.severity}
        >
          {alert.text}
        </Alert>
      ))}
    </Container>
  )
}
