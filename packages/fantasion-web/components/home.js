import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { useTranslation } from 'next-i18next'

import styles from './home.module.scss'

const Witcher = () => {
  return <div className={styles.witcher} />
}

export const HomeFlavour = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <Row className="align-items-center">
        <Col xs={12} md={6}>
          <h1 className="d-none">{t('fantasion-title')}</h1>
          <p className="lead fs-1 text-center">
            {t('fantasion-general-description')}
          </p>
        </Col>
        <Col xs={12} md={6}>
          <Witcher />
        </Col>
      </Row>
    </Container>
  )
}
