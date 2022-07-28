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
import { Footer } from './layout/Footer.js'
import { HeadingContext, PageTopGallery } from './media'
import { Link, NavLink } from './links'
import { Money } from './money'
import { reverse } from '../routes'
import { SiteLogo } from './SiteLogo'
import { useActiveOrder, useLang, useSite, useUser } from './context'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useOutsideClick, useScroll } from './window'
import { UserName } from './users'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import {
  HamburgerMenuIcon,
  HomeIcon,
  BasketIcon,
  LogoutIcon,
  IconLabel,
} from './icons'

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
  const { user } = useSite()
  return (
    <Nav className="flex-grow-1">
      <NavLink route="adventureList">{t('adventures-title')}</NavLink>
      <NavLink route="leisureCentreList">{t('leisure-centre-title')}</NavLink>
      <NavDropdown title={t('about-fantasion')} id="about-nav">
        <Link as={NavDropdown.Item} route="about">
          {t('about-us')}
        </Link>
        <Link as={NavDropdown.Item} route="team">
          {t('our-team')}
        </Link>
      </NavDropdown>
      <NavLink route="contacts">{t('contacts-link')}</NavLink>
      {!user && (
        <NavLink className="ms-lg-auto me-lg-2" key="login" route="login">
          {t('login')}
        </NavLink>
      )}
    </Nav>
  )
}

const UserMenu = () => {
  const { t } = useTranslation()
  const { logout, user } = useSite()
  const order = useActiveOrder()
  const basketPrice = order ? order.price : 0
  const items = [
    ...(user?.passwordCreated
      ? [
          <NavLink key="status" route="status">
            <IconLabel icon={HomeIcon} text={t('my-status')} />
          </NavLink>,
          <NavLink key="basket" route="basket">
            <IconLabel
              icon={BasketIcon}
              text={
                <>
                  {t('order-basket')}: <Money amount={basketPrice} />
                </>
              }
            />
          </NavLink>,
          <Nav.Link key="logout" onClick={logout}>
            <IconLabel icon={LogoutIcon} text={t('logout')} />
          </Nav.Link>,
        ]
      : []),
  ].filter(Boolean)

  if (items.length === 0) {
    return null
  }

  return <Nav className={styles.userMenu}>{items}</Nav>
}

export const SiteNavbar = ({ fixed, sticky }) => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [scrollTop] = useScroll()
  const [expanded, setExpanded] = useState(false)
  const { user } = useSite()

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
        <Navbar.Collapse id="site-navbar">
          <SiteMenu />
          <UserMenu />
        </Navbar.Collapse>
        <div className={styles.menuWidget}>
          <Navbar.Toggle
            aria-controls="site-navbar"
            className={styles.navbarToggle}
          >
            <BasketNotice />
            <CurrentUserName />
            {user?.passwordCreated && <HamburgerMenuIcon />}
          </Navbar.Toggle>
        </div>
      </Container>
    </Navbar>
  )
}

export const PageContent = ({ children }) => (
  <div className={styles.content}>
    <HeadingContext>{children}</HeadingContext>
  </div>
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
