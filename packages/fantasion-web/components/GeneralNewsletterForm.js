import classNames from 'classnames'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useTranslation } from 'next-i18next'

import styles from './GeneralNewsletterForm.module.scss'

export const GeneralNewsletterForm = ({
  title,
  variant = 'primary',
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <>
      <h2 {...props}>{title || t('newsletter-general-title')}</h2>
      <form
        action="https://fantasion.us20.list-manage.com/subscribe/post?u=7af44209676d38653a2a4a1a0&amp;id=a01ed947e0"
        method="post"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
        noValidate
      >
        <Form.Group className="row">
          <Form.Label
            className="col-xs-12 col-md-2 col-form-label"
            htmlFor="mce-EMAIL"
          >
            {t('newsletter-your-email')}:
          </Form.Label>
          <Col xs={12} md={10}>
            <Form.Control
              type="email"
              name="EMAIL"
              className={classNames(styles.emailField)}
              id="mce-EMAIL"
              required
            />
          </Col>
        </Form.Group>
        <input
          type="hidden"
          name="b_7af44209676d38653a2a4a1a0_a01ed947e0"
          tabIndex="-1"
          value=""
        />
        <input type="hidden" name="subscribe" tabIndex="-1" value="" />
        <div className="mt-3">
          <Button type="submit" className="button" variant={variant}>
            {t('newsletter-submit')}
          </Button>
        </div>
      </form>
    </>
  )
}
