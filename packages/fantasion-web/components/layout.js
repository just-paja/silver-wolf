import Container from 'react-bootstrap/Container'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'

import { A } from './links'
import { SocialNetworks } from '../components/social'
import { useTranslation } from 'next-i18next'

import styles from './layout.module.scss'

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
    <SocialNetworks className={styles.social} />
    <div className={styles.footerInfo}>
      <FooterLinks />
      <CopyrightNotice />
    </div>
  </Container>
)
