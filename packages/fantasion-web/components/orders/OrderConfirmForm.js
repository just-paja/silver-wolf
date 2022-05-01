import { bool } from 'yup'
import { Form, FormControls, Input, useValidator } from '../forms'
import { Link } from '../links'
import { Trans, useTranslation } from 'next-i18next'

export const OrderConfirmForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  const validator = useValidator({
    requestInsurance: bool().oneOf([true, false], t('form-input-required')),
    termsAndConditions: bool().oneOf([true], t('form-input-required')),
  })
  return (
    <Form onSubmit={onSubmit} resolver={validator}>
      <Input
        type="checkbox"
        name="requestInsurance"
        label={t('order-request-insurance')}
      />
      <Input
        type="checkbox"
        name="termsAndConditions"
        label={
          <Trans
            i18nKey={'consent-with-plural'}
            values={{ subject: t('order-agree-terms-and-conditions') }}
            components={[
              <Link
                external
                key="termsAndConditions"
                route="termsAndConditions"
              >
                {t('order-agree-terms-and-conditions')}
              </Link>,
            ]}
          />
        }
        required
      />
      <FormControls size="lg" submitLabel={t('order-confirm')} />
    </Form>
  )
}
