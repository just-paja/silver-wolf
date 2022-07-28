import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { Link } from '../links'
import { SiteLogo } from '../SiteLogo'
import { SocialNetworks } from '../social'
import { useTranslation } from 'next-i18next'

import styles from './Footer.module.scss'

const FooterLinks = () => {
  const { t } = useTranslation()
  return (
    <nav>
      <ul className={styles.quickLinks}>
        <li>
          <Link route="codex">{t('codex-title')}</Link>
        </li>
        <li>
          <Link route="cookiesPolicy">{t('cookies')}</Link>
        </li>
        <li>
          <Link route="privacyPolicy">{t('personal-information')}</Link>
        </li>
        <li>
          <Link route="termsAndConditions">{t('terms-and-conditions')}</Link>
        </li>
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
