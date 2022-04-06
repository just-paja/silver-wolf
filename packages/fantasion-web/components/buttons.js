import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import styles from './buttons.module.scss'

import { CopyIcon } from './icons'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'

const ReflessInteractiveButton = (
  { children, disabled, inProgress, ...props },
  ref
) => {
  return (
    <Button {...props} disabled={disabled || inProgress} ref={ref}>
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

export const InteractiveButton = forwardRef(ReflessInteractiveButton)

export const CopyButton = ({ value }) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const hideTooltip = () => setShow(false)
  const target = useRef(null)
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(hideTooltip, 800)
      return () => clearTimeout(timeout)
    }
  }, [show])

  const copyValue = async () => {
    setInProgress(true)
    try {
      await navigator.clipboard.writeText(value)
      setShow(true)
    } finally {
      setInProgress(false)
    }
  }
  return (
    <>
      <InteractiveButton
        className={styles.copyButton}
        inProgress={inProgress}
        onClick={copyValue}
        ref={target}
        variant="outline-light"
      >
        <CopyIcon />
      </InteractiveButton>
      <Overlay target={target.current} show={show} placement="left">
        {(props) => <Tooltip {...props}>{t('copied')}</Tooltip>}
      </Overlay>
    </>
  )
}
