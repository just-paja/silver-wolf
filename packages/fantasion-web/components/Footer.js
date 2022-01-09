import Container from 'react-bootstrap/Container'

import { SocialNetworks } from '../components/social'

import styles from './Footer.module.scss'

export const Footer = () => (
  <Container as="footer" className={styles.footer}>
    <SocialNetworks className={styles.social} />
  </Container>
)
