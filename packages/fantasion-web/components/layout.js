import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'

import { Link, Linker } from './links'
import { SocialNetworks } from '../components/social'
import { useTranslation } from 'next-i18next'
import { SiteLogo } from './SiteLogo'
import { useScroll } from './scroll'
import { HiMenu } from 'react-icons/hi'
import { useState } from 'react'

import styles from './layout.module.scss'

export const SiteNavbar = () => {
  const { t } = useTranslation()
  const [scrollTop] = useScroll()
  const [expanded, setExpanded] = useState(false)

  return (
    <Navbar
      className={classnames('pt-1 pb-1 mb-3', styles.navbar, {
        [styles.navbarInverse]: scrollTop > 30,
        [styles.navbarExpanded]: expanded,
      })}
      expand="lg"
      expanded={expanded}
      sticky="top"
      onToggle={setExpanded}
    >
      <Container>
        <Linker route="home">
          <Navbar.Brand
            className={classnames(
              styles.navbarBrand,
              'd-inline-flex align-items-center'
            )}
          >
            <SiteLogo className={styles.logo} />{' '}
            <span>{t('fantasion-brand')}</span>
          </Navbar.Brand>
        </Linker>
        <Navbar.Toggle
          aria-controls="site-navbar"
          className={styles.navbarToggle}
        >
          <HiMenu />
        </Navbar.Toggle>
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
          <Link route="privacyPolicy">{t('cookies')}</Link>
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

export const GenericPage = ({ children }) => (
  <>
    <PageContent>
      <SiteNavbar />
      <main>{children}</main>
    </PageContent>
    <Footer />
  </>
)
