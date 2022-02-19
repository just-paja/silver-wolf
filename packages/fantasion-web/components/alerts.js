import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const AlertContext = createContext({})

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([])
  const addAlert = useCallback(
    (alert) => setAlerts([...alerts, alert]),
    [alerts, setAlerts]
  )
  const removeAlert = useCallback(
    (alertId) => setAlerts(alerts.filter((alert) => alert.id !== alertId)),
    [alerts, setAlerts]
  )
  const context = useMemo(
    () => ({
      alerts,
      addAlert,
      removeAlert,
    }),
    [alerts, addAlert, removeAlert]
  )
  return (
    <AlertContext.Provider value={context}>{children}</AlertContext.Provider>
  )
}

export const useAlerts = () => useContext(AlertContext)

export const Alerts = () => {
  const { alerts, removeAlert } = useAlerts()
  if (alerts.length === 0) {
    return null
  }
  return (
    <Container>
      {alerts.map((alert) => (
        <Alert
          className="m-auto mb-4"
          key={alert.id}
          onClose={() => removeAlert(alert.id)}
          variant={alert.severity}
        >
          {alert.text}
        </Alert>
      ))}
    </Container>
  )
}
