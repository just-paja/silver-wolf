import classnames from 'classnames'
import PasswordStrengthBar from 'react-password-strength-bar'
import BsForm from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import { forwardRef, useState } from 'react'
import { SecureIcon, InsecureIcon, SecurityWarningIcon } from './icons'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import styles from './passwords.module.scss'

const getTitle = (feedback) => {
  let text = []
  if (feedback?.warning) {
    text.push(feedback.warning)
  }
  if (feedback?.suggestions) {
    text = text.concat(feedback.suggestions)
  }
  return text.join(' ')
}

const getIcon = (level, feedback) => {
  const title = getTitle(feedback)
  if (level >= 4) {
    return <SecureIcon className="text-success" title={title} />
  }
  if (level >= 3) {
    return <SecurityWarningIcon className="text-warning" title={title} />
  }
  return <InsecureIcon className="text-danger" title={title} />
}

const ReflessPasswordStrenghtInput = (
  // eslint-disable-next-line no-unused-vars
  { className, controlId, id, ...props },
  ref
) => {
  const [level, setLevel] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const { t } = useTranslation()
  const { watch } = useFormContext()
  const icon = getIcon(level, feedback)
  const value = watch(props.name)
  const scoreWords = [
    t('password-dangerous'),
    t('password-weak'),
    t('password-okay'),
    t('password-good'),
    t('password-strong'),
  ]
  return (
    <InputGroup className={classnames('f-input', styles.size, className)}>
      <BsForm.Control {...props} ref={ref} />
      <InputGroup.Text as="div">
        {icon}
        <PasswordStrengthBar
          className={styles.strengthBar}
          password={value || ''}
          scoreWords={scoreWords}
          onChangeScore={(score, feedback) => {
            setLevel(score)
            setFeedback(feedback)
          }}
          shortScoreWord={t('password-too-short')}
        />
      </InputGroup.Text>
    </InputGroup>
  )
}

export const PasswordStrengthInput = forwardRef(ReflessPasswordStrenghtInput)
