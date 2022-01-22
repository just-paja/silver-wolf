import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'next-i18next'

import styles from './home.module.scss'

const FLAVOUR_TEXT_TTL = 16000

const getRandomIndex = (items) => Math.floor(Math.random() * items.length)

const getRandomFilteredIndex = (items, currentIndex) => {
  // Oh my glob. There has to be a better way to do this. But time is mana.
  const baseArray = Object.keys(items)
    .map((key) => parseInt(key, 10))
    .filter((key) => key !== currentIndex)
  if (baseArray.length === 0) {
    return null
  }
  return baseArray[getRandomIndex(baseArray)]
}

const FlavourText = ({ quoteOwner, text, ...props }) => {
  const [height, setHeight] = useState(32)
  const lineRef = useRef()

  useEffect(() => {
    if (lineRef.current) {
      setHeight(lineRef.current.clientHeight)
    }
  }, [quoteOwner, text])

  return (
    <blockquote {...props} style={{ height }}>
      <span className={styles.flavourLine} ref={lineRef}>
        <span>&quot;{text}&quot;</span>
        {' -'}&nbsp;
        <span>{quoteOwner}</span>
      </span>
    </blockquote>
  )
}

const FlavourTextCarousel = ({ flavourTexts, ...props }) => {
  const [flavourIndex, setFlavourIndex] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextIndex = getRandomFilteredIndex(flavourTexts, flavourIndex)
      if (nextIndex !== null) {
        setFlavourIndex(nextIndex)
      }
    }, FLAVOUR_TEXT_TTL)

    return () => {
      clearTimeout(timeout)
    }
  })

  const flavour = flavourTexts[flavourIndex]
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
