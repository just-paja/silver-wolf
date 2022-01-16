import Container from 'react-bootstrap/Container'

import { SocialNetworks } from '../components/social'

import styles from './layout.module.scss'

export const PageContent = ({ children }) => (
  <div className={styles.content}>{children}</div>
)

export const Footer = () => (
  <Container as="footer" className={styles.footer}>
    <SocialNetworks className={styles.social} />
  </Container>
)
