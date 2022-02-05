import { Form, FormControls, Input, Submit } from './forms'
import { useTranslation } from 'next-i18next'

export const LoginForm = ({}) => {
  const { t } = useTranslation()
  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input label={t('login-email')} name="email" type="email" required />
      <Input label={t('login-password')} name="password" required />
      <FormControls submitLabel={t('login-submit')} />
    </Form>
  )
}
