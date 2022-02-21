import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { Form, FormControls, FormError, Input } from './forms'
import { Link } from './links'
import { useTranslation } from 'next-i18next'

import styles from './login.module.scss'

export const LoginForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  return (
    <Form className={styles.form} id="login" onSubmit={onSubmit}>
      <Input label={t('login-email')} name="email" type="email" required />
      <Input
        label={t('login-password')}
        name="password"
        type="password"
        required
      />
      <FormError />
      <Row>
        <Col className="flex-grow-0 flex-shrink-1">
          <FormControls submitLabel={t('login-submit')} />
        </Col>
        <Col>
          <div className="mt-4">
            <Link route="forgottenPassword">
              {t('login-forgotten-password')}
            </Link>
          </div>
        </Col>
      </Row>
    </Form>
  )
}

export const ForgottenPasswordForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  return (
    <Form className={styles.form} id="login" onSubmit={onSubmit}>
      <Input label={t('login-email')} name="email" type="email" required />
      <FormControls submitLabel={t('forgotten-password-submit')} />
    </Form>
  )
}
