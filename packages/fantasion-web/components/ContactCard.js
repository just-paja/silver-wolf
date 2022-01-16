import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { useTranslation } from 'next-i18next'

export const ContactCard = () => {
  const { t } = useTranslation()
  return (
    <Card>
      <ListGroup variant="flush">
        <ListGroup.Item>
          {t('contact-email')}:{' '}
          <a href="mailto:info@fantasion.cz">info@fantasion.cz</a>
        </ListGroup.Item>
        <ListGroup.Item>
          {t('contact-phone')}:{' '}
          <a href="tel:+420 605 527 276">+420 605 527 276</a>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}
