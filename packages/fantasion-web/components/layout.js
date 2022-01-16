import Container from 'react-bootstrap/Container'
import Link from 'next/link'
import Navbar from 'react-bootstrap/Navbar'

import { A } from './links'
import { SocialNetworks } from '../components/social'
import { useTranslation } from 'next-i18next'
import { SiteLogo } from './SiteLogo'

import styles from './layout.module.scss'

export const SiteNavbar = () => {
  const { t } = useTranslation()
  return (
    <Navbar className="pt-1 pb-1 mb-3" expand="lg" variant="dark" bg="primary">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>
            <SiteLogo className={styles.logo} /> {t('fantasion-brand')}
          </Navbar.Brand>
        </Link>
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
    <div>
      <strong>Sledujte nás</strong>
      <SocialNetworks className={styles.social} />
    </div>
    <div className={styles.footerInfo}>
      <FooterLinks />
      <CopyrightNotice />
    </div>
  </Container>
)
