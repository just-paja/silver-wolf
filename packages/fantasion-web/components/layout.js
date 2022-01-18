import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'

import { A, Linker } from './links'
import { SocialNetworks } from '../components/social'
import { useTranslation } from 'next-i18next'
import { SiteLogo } from './SiteLogo'

import styles from './layout.module.scss'

export const SiteNavbar = () => {
  const { t } = useTranslation()
  return (
    <Navbar className="pt-1 pb-1 mb-3" expand="lg" variant="dark" bg="primary">
      <Container>
        <Linker route="home">
          <Navbar.Brand>
            <SiteLogo className={styles.logo} /> {t('fantasion-brand')}
          </Navbar.Brand>
        </Linker>
        <Navbar.Collapse id="site-navbar">
          <Nav>
            <Linker route="about">
              <Nav.Link>{t('about-us')}</Nav.Link>
            </Linker>
            <Linker route="contacts">
              <Nav.Link>{t('contacts-link')}</Nav.Link>
            </Linker>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export const PageContent = ({ children }) => (
  <div className={styles.content}>{children}</div>
)

const FooterLinks = () => {
  const { t } = useTranslation()
  return (
    <nav>
      <ul className={styles.quickLinks}>
        <li>
          <A href="/cookies">{t('cookies')}</A>
        </li>
        <li>
          <A href="">{t('personal-information')}</A>
        </li>
        <li>
          <A href="">{t('usage-terms')}</A>
        </li>
        <li>
          <A href="">{t('terms-and-conditions')}</A>
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
