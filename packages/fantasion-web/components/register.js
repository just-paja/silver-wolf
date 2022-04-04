import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { bool, string } from 'yup'
import { Form, FormControls, Input, useValidator } from './forms'
import { Link } from './links'
import { PasswordStrengthInput } from './passwords'
import { Trans, useTranslation } from 'next-i18next'

export const RegisterForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  const validator = useValidator({
    firstName: string()
      .nullable()
      .min(1)
      .max(127)
      .required(t('form-input-required')),
    lastName: string()
      .nullable()
      .min(1)
      .max(127)
      .required(t('form-input-required')),
    email: string().nullable().email().required(),
    phone: string().nullable().required(),
    privacy: bool().oneOf([true], t('form-input-required')),
  })

  return (
    <Form id="register" onSubmit={onSubmit} resolver={validator}>
      <Input label={t('user-first-name')} name="firstName" type="text" />
      <Input label={t('user-last-name')} name="lastName" type="text" required />
      <Input
        helpText={t('user-email-help-text')}
        label={t('user-email')}
        name="email"
        type="email"
      />
      <Input
        helpText={t('user-phone-number-help-text')}
        label={t('user-phone-number')}
        name="phone"
        type="tel"
      />
      <Input
        label={
          <Trans
            i18nKey={'consent-with'}
            values={{ subject: t('personal-information-processing') }}
            components={[
              <Link external key="privacyPolicy" route="privacyPolicy">
                {t('personal-information-processing')}
              </Link>,
            ]}
          />
        }
        name="privacy"
        type="checkbox"
      />
      <FormControls submitLabel={t('register-submit')} />
    </Form>
  )
}

export const RegisterFormSuccess = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <Row>
        <Col lg={{ span: 6, offset: 3 }} className="mt-4">
          <Alert variant="success">{t('register-success')}</Alert>
          <p>{t('register-success-info')}</p>
        </Col>
      </Row>
    </Container>
  )
}

export const CreatePasswordForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  const validator = useValidator({
    password: string()
      .nullable()
      .min(6)
      .max(255)
      .required(t('form-input-required')),
    passwordConfirm: string()
      .nullable()
      .min(6)
      .max(255)
      .required(t('form-input-required')),
  })
  return (
    <Form id="register" onSubmit={onSubmit} resolver={validator}>
      <Input
        as={PasswordStrengthInput}
        helpText={t('user-password-help-text')}
        label={t('user-password')}
        name="password"
        type="password"
      />
      <Input
        helpText={t('user-password-confirm-help-text')}
        label={t('user-password-confirm')}
        name="passwordConfirm"
        type="password"
      />
      <FormControls submitLabel={t('verification-finish')} />
    </Form>
  )
}
