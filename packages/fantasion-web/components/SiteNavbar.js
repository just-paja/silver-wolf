import Container from 'react-bootstrap/Container'
import Link from 'next/link'
import Navbar from 'react-bootstrap/Navbar'

import { SiteLogo } from './SiteLogo'
import { useTranslation } from 'next-i18next'

import styles from './SiteNavbar.module.scss'

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
