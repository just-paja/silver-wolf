import { Form, FormControls, Input } from './forms'
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
      <FormControls submitLabel={t('login-submit')}>
        <Link className="ms-3" route="forgottenPassword">
          {t('login-forgotten-password')}
        </Link>
      </FormControls>
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
