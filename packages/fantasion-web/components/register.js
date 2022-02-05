import { Form, FormControls, Input, Submit } from './forms'
import { Trans, useTranslation } from 'next-i18next'
import { Link } from './links'

export const RegisterForm = ({}) => {
  const { t } = useTranslation()
  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  return (
    <Form id="register" onSubmit={onSubmit}>
      <Input
        helpText={t('user-name-help-text')}
        label={t('user-name')}
        name="name"
        type="text"
        required
      />
      <Input
        helpText={t('user-email-help-text')}
        label={t('user-email')}
        name="email"
        type="email"
        required
      />
      <Input
        helpText={t('user-phone-number-help-text')}
        label={t('user-phone-number')}
        name="phone"
        type="tel"
        required
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
        required
      />
      <FormControls submitLabel={t('register-submit')} />
    </Form>
  )
}
