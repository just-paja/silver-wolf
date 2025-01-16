import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { Address } from './addresses'
import { Heading, Section } from './media'
import { useTranslation } from 'next-i18next'
import {
  ACCOUNT_BANK,
  ACCOUNT_BIC,
  ACCOUNT_IBAN,
  ACCOUNT_NUMBER,
} from './money'

const CONTACT_TEL = '+420 732 368 412'

export const ContactCard = () => {
  const { t } = useTranslation()
  return (
    <>
      <Card className="mt-3">
        <ListGroup variant="flush">
          <ListGroup.Item>
            {t('contact-email')}:{' '}
            <a href="mailto:info@fantasion.cz">info@fantasion.cz</a>
          </ListGroup.Item>
          <ListGroup.Item>
            {t('contact-phone')}: <a href="tel:{CONTACT_TEL}">{CONTACT_TEL}</a>
          </ListGroup.Item>
          <ListGroup.Item>{t('contact-in')}: 14166658</ListGroup.Item>
        </ListGroup>
      </Card>
      <Section className="mt-4">
        <Heading>{t('contact-address')}</Heading>
        <Card className="mt-3">
          <Card.Body>
            <Address
              city="Praha 4 Krč"
              street="Blažíčkova"
              streetNumber="984/20"
              postalCode="140 00"
            />
          </Card.Body>
        </Card>
      </Section>

      <Section className="mt-4">
        <Heading>{t('bank-connection')}</Heading>
        <Card className="mt-3">
          <ListGroup variant="flush">
            <ListGroup.Item>
              {t('bank-account-number')}: {ACCOUNT_NUMBER}
            </ListGroup.Item>
            <ListGroup.Item>
              {t('bank-account-bank')}: {ACCOUNT_BANK}
            </ListGroup.Item>
            <ListGroup.Item>
              {t('bank-account-iban')}: {ACCOUNT_IBAN}
            </ListGroup.Item>
            <ListGroup.Item>
              {t('bank-account-bic')}: {ACCOUNT_BIC}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Section>
    </>
  )
}
