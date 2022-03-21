import { Form, FormControls, FormError, Input } from './forms'
import { useTranslation } from 'next-i18next'

import styles from './contact.module.scss'

export const ContactForm = () => {
  const { t } = useTranslation()
  return (
    <Form className={styles.form} id="contact-form">
      <Input
        label={t('contact-form-email')}
        name="email"
        type="email"
        required
      />
      <div className="flex-grow-0 flex-shrink-1">
        <Input
          label={t('contact-form-message')}
          name="message"
          type="textarea"
          placeholder={t('contact-form-placeholder')}
          rows={5}
          required
        />
      </div>
      <FormError />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControls submitLabel={t('contact-form-submit')} />
      </div>
    </Form>
  )
}
