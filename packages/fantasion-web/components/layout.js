import Badge from 'react-bootstrap/Badge'
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
import { HamburgerMenuIcon, HomeIcon, BasketIcon, LogoutIcon } from './icons'
import { Link } from './links'
import { HeadingContext, PageTopGallery } from './media'
import { Money } from './money'
import { reverse } from '../routes'
import { SiteLogo } from './SiteLogo'
import { SocialNetworks } from './social'
import { useActiveOrder, useLang, useSite, useUser } from './context'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useOutsideClick, useScroll } from './window'
import { useRouter } from 'next/router'
import { UserName } from './users'
import { useTranslation } from 'next-i18next'

import styles from './layout.module.scss'

const expandOn = 'lg'

const BasketNotice = () => {
  const [show, setShow] = useState(false)
  const order = useActiveOrder()
  const icon = useRef()

  useEffect(() => {
    const to = setTimeout(() => setShow(true), 1000)
    return () => clearTimeout(to)
  }, [order])

  if (!order || order.items.length === 0) {
    return null
  }

  return (
    <span className={styles.basketIcon} ref={icon}>
      {' '}
      <BasketIcon />
      <Badge
        pill
        bg="danger"
        className={classnames(styles.basketBadge, { [styles.show]: show })}
      >
        {order.items.length}
      </Badge>
    </span>
  )
}

const CurrentUserName = () => (
  <UserName user={useUser()} className={styles.menuUserName} />
)

const SiteMenu = () => {
  const { t } = useTranslation()
  return (
    <Nav>
      <Link as={Nav.Link} route="adventureList">
        {t('adventures-title')}
      </Link>
      <Link as={Nav.Link} route="leisureCentreList">
        {t('leisure-centre-title')}
      </Link>
      <NavDropdown title={t('about-fantasion')} id="about-nav">
        <Link as={NavDropdown.Item} route="about">
          {t('about-us')}
        </Link>
        <Link as={NavDropdown.Item} route="team">
          {t('our-team')}
        </Link>
      </NavDropdown>
      <Link as={Nav.Link} route="contacts">
        {t('contacts-link')}
      </Link>
      <Link as={Nav.Link} route="faq">
        {t('faq-link')}
      </Link>
    </Nav>
  )
}

const UserMenu = () => {
  const { t } = useTranslation()
  const { logout, user } = useSite()
  const order = useActiveOrder()
  const basketPrice = order ? order.price : 0
  const items = [
    ...(user
      ? []
      : [
          <Link as={Nav.Link} key="login" route="login">
            {t('login')}
          </Link>,
          <Link as={Nav.Link} key="register" route="register">
            {t('register-title')}
          </Link>,
        ]),
    ...(user?.passwordCreated
      ? [
          <Link as={Nav.Link} key="basket" route="basket">
            <BasketIcon /> {t('order-basket')}: <Money amount={basketPrice} />
          </Link>,
          <Link as={Nav.Link} key="status" route="status">
            <HomeIcon /> {t('my-status')}
          </Link>,
          <Nav.Link key="logout" onClick={logout}>
            <LogoutIcon /> {t('logout')}
          </Nav.Link>,
        ]
      : []),
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
        <Link
          as={Navbar.Brand}
          route="home"
          className={classnames(
            styles.navbarBrand,
            'd-inline-flex align-items-center'
          )}
        >
          <SiteLogo className={styles.logo} />{' '}
          <span>{t('fantasion-brand')}</span>
        </Link>
        <div className={styles.menuWidget}>
          <Navbar.Toggle
            aria-controls="site-navbar"
            className={styles.navbarToggle}
          >
            <BasketNotice />
            <CurrentUserName />
            <HamburgerMenuIcon />
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
  <div className={styles.content}>
    <HeadingContext>{children}</HeadingContext>
  </div>
)

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
const runesLinks = [
  'adventureList',
  'leisureCentreList',
  'bestiary',
  'about',
  'team',
]

export const Runes = () => {
  const router = useRouter()
  const lang = useLang()
  return (
    <div className={styles.runes}>
      {runes.map((Rune, index) => (
        <Rune
          className={styles.rune}
          fill="currentColor"
          key={index}
          onClick={() => {
            router.push(reverse(lang, runesLinks[index]))
          }}
        />
      ))}
    </div>
  )
}
