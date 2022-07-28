import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { Link } from '../links'
import { SiteLogo } from '../SiteLogo'
import { SocialNetworks } from '../social'
import { useTranslation } from 'next-i18next'

import styles from './Footer.module.scss'

const FooterLink = ({ route, label }) => (
  <li>
    <Link route={route}>{label}</Link>
  </li>
)

const FooterLinks = () => {
  const { t } = useTranslation()
  return (
    <nav>
      <ul className={styles.quickLinks}>
        <FooterLink route="codex" label={t('codex-title')} />
        <FooterLink route="cookiesPolicy" label={t('cookies')} />
        <FooterLink route="privacyPolicy" label={t('personal-information')} />
      </ul>
      <ul className={styles.quickLinks}>
        <FooterLink
          route="termsAndConditions"
          label={t('terms-and-conditions')}
        />
        <FooterLink route="faq" label={t('faq-link')} />
      </ul>
    </nav>
  )
}

const CopyrightNotice = () => (
  <div>
    © 2021 - {new Date().getFullYear()}{' '}
    {useTranslation().t('fantasion-company-name')}
  </div>
)

export const Footer = () => (
  <Container as="footer" className={styles.footer}>
    <Row>
      <Col md={9}>
        <div>
          <strong>Sledujte nás</strong>
          <SocialNetworks className={styles.social} />
        </div>
        <div className={styles.footerInfo}>
          <FooterLinks />
          <CopyrightNotice />
        </div>
      </Col>
      <Col className="d-flex justify-content-end" md={3}>
        <SiteLogo className={styles.footerLogo} />
      </Col>
    </Row>
  </Container>
)
