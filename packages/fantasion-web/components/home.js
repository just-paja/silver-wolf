import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { useTranslation } from 'next-i18next'

import styles from './home.module.scss'

const FlavourText = ({ quoteOwner, text, ...props }) => {
  return (
    <blockquote {...props}>
      <span>&quot;{text}&quot;</span>
      {' -'}&nbsp;
      <span>{quoteOwner}</span>
    </blockquote>
  )
}

const FlavourTextCarousel = ({ flavourTexts, ...props }) => {
  const flavour = flavourTexts[0]
  if (!flavour) {
    return null
  }
  return (
    <FlavourText
      quoteOwner={flavour.quoteOwner}
      text={flavour.text}
      {...props}
    />
  )
}

const Witcher = () => {
  return <div className={styles.witcher} />
}

export const HomeFlavour = ({ flavourTexts }) => {
  const { t } = useTranslation()
  return (
    <Container>
      <Row className="align-items-center">
        <Col xs={12} md={6} className="d-flex justify-content-center">
          <h1 className="d-none">{t('fantasion-title')}</h1>
          <div className={styles.flavour}>
            <p className={classnames('text-center', styles.missionText)}>
              {t('fantasion-general-description')}
            </p>
            <FlavourTextCarousel
              className={classnames('d-none d-md-block', styles.flavourText)}
              flavourTexts={flavourTexts}
            />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <Witcher />
        </Col>
      </Row>
    </Container>
  )
}
