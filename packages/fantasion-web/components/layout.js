import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Rune01 from './runes/rune-01.svg'
import Rune02 from './runes/rune-02.svg'
import Rune03 from './runes/rune-03.svg'
import Rune04 from './runes/rune-04.svg'
import Rune05 from './runes/rune-05.svg'

import { Alerts } from './alerts'
import { HiMenu } from 'react-icons/hi'
import { Link, Linker } from './links'
import { PageTopGallery } from './media'
import { SiteLogo } from './SiteLogo'
import { SocialNetworks } from '../components/social'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useOutsideClick, useScroll } from './window'
import { useSite, useUser } from './context'
import { useTranslation } from 'next-i18next'

import styles from './layout.module.scss'

const expandOn = 'lg'

const getFullName = (user) => `${user.firstName} ${user.lastName}`

const UserName = () => {
  const user = useUser()
  return user ? (
    <span className={styles.menuUserName}>{getFullName(user)}</span>
  ) : null
}

const SiteMenu = () => {
  const { t } = useTranslation()
  return (
    <Nav>
      <Linker route="adventureList">
        <Nav.Link>{t('adventures-title')}</Nav.Link>
      </Linker>
      <Linker route="leisureCentreList">
        <Nav.Link>{t('leisure-centre-title')}</Nav.Link>
      </Linker>
      <NavDropdown title={t('about-fantasion')} id="about-nav">
        <Linker route="about">
          <NavDropdown.Item>{t('about-us')}</NavDropdown.Item>
        </Linker>
        <Linker route="team">
          <NavDropdown.Item>{t('our-team')}</NavDropdown.Item>
        </Linker>
      </NavDropdown>
      <Linker route="contacts">
        <Nav.Link>{t('contacts-link')}</Nav.Link>
      </Linker>
    </Nav>
  )
}

const UserMenu = () => {
  const { t } = useTranslation()
  const { logout, user } = useSite()
  const items = [
    !user && (
      <Linker key="login" route="login">
        <Nav.Link>{t('login')}</Nav.Link>
      </Linker>
    ),
    user?.passwordCreated && (
      <Nav.Link key="logout" onClick={logout}>
        {t('logout')}
      </Nav.Link>
    ),
  ].filter(Boolean)

  return <Nav className={styles.userMenu}>{items}</Nav>
}

export const SiteNavbar = ({ fixed, sticky }) => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [scrollTop] = useScroll()
  const [expanded, setExpanded] = useState(false)

  const handleClickOutside = () => {
    setExpanded(false)
  }

  useOutsideClick(ref, handleClickOutside)

  return (
    <Navbar
      className={classnames('pt-1 pb-1 mb-3', styles.navbar, {
        [styles.navbarInverse]: scrollTop > 30,
        [styles.navbarExpanded]: expanded,
      })}
      expand={expandOn}
      expanded={expanded}
      sticky={sticky ? 'top' : null}
      fixed={fixed ? 'top' : null}
      onToggle={setExpanded}
      ref={ref}
    >
      <Container className="position-relative">
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
        <div className={styles.menuWidget}>
          <Navbar.Toggle
            aria-controls="site-navbar"
            className={styles.navbarToggle}
          >
            <UserName />
            <HiMenu />
          </Navbar.Toggle>
        </div>
        <Navbar.Collapse id="site-navbar">
          <SiteMenu />
          <UserMenu />
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
          <Link route="faq">{t('faq-title-short')}</Link>
        </li>
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
      <SiteNavbar sticky />

      <main>
        <Alerts />
        {children}
      </main>
      <Runes />
    </PageContent>
    <Footer />
  </>
)

export const GalleryPage = ({ children, media }) => {
  const [width, setWidth] = useState(0)
  const resize = useCallback(() => {
    setWidth(global.window.innerWidth)
  }, [])
  useEffect(() => {
    global.window.addEventListener('resize', resize)
    resize()
    return () => {
      global.window.removeEventListener('resize', resize)
    }
  }, [resize])
  const fixed = width < 1200
  return (
    <Container fluid>
      <Row className={styles.galleryPageRow}>
        <PageTopGallery media={media} size="galleryDetail" />
        <Col xl={media.length === 0 ? 12 : 7}>
          <PageContent>
            <main>
              <SiteNavbar sticky={!fixed} fixed={fixed} />
              {children}
            </main>
          </PageContent>
          <Footer />
        </Col>
      </Row>
    </Container>
  )
}

const runes = [Rune01, Rune02, Rune03, Rune04, Rune05]

export const Runes = () => {
  const [scrollTop, scrollTopMax] = useScroll()
  const distance = scrollTopMax === 0 ? 1 : scrollTop / scrollTopMax

  return (
    <div className={styles.runes}>
      {runes.map((Rune, index) => (
        <Rune
          className={styles.rune}
          fill="currentColor"
          key={index}
          style={{ opacity: distance }}
        />
      ))}
    </div>
  )
}
