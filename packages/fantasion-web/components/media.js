import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { CloseIcon, NextIcon, PrevIcon } from './icons'
import { HeadingLevelContext, useHeadingLevel } from './context'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'

import styles from './media.module.scss'

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

export const useRotatingIndex = (items, ttl = 16000) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextIndex = getRandomFilteredIndex(items, index)
      if (nextIndex !== null) {
        setIndex(nextIndex)
      }
    }, ttl)

    return () => {
      clearTimeout(timeout)
    }
  })

  return [index, setIndex]
}

export const HeadingContext = ({ children, baseLevel }) => (
  <HeadingLevelContext.Provider value={baseLevel || 0}>
    {children}
  </HeadingLevelContext.Provider>
)

export const Heading = ({ level, relativeLevel = 0, children, ...props }) => {
  const headingLevel = useHeadingLevel()
  const Component = `h${level || headingLevel + (relativeLevel || 1)}`
  return <Component {...props}>{children}</Component>
}

export const Section = ({
  children,
  component: Component = 'section',
  headingLevel = 1,
  ...props
}) => (
  <Component {...props}>
    <HeadingContext baseLevel={useHeadingLevel() + headingLevel}>
      {children}
    </HeadingContext>
  </Component>
)

export const Main = ({ children, ...props }) => (
  <Section headingLevel={0} {...props}>
    {children}
  </Section>
)

const PreviewImage = ({ localPhoto, size, ...props }) => {
  return (
    <div {...props}>
      <img className={styles.galleryImage} alt="" src={localPhoto[size]} />
    </div>
  )
}

const PreviewDiv = ({ className, localPhoto, size, ...props }) => {
  return (
    <div
      {...props}
      className={classnames(className, styles.previewDiv)}
      style={{ backgroundImage: `url(${localPhoto[size]})` }}
    />
  )
}

const LocalPhoto = ({
  previewComponent: PreviewComponent = PreviewImage,
  localPhoto,
  ...props
}) => <PreviewComponent localPhoto={localPhoto} {...props} />

const MediaObject = ({ className, mediaObject, onDetail, ...props }) => {
  const onClick = onDetail ? (e) => onDetail(mediaObject, e) : null
  const composedClass = classnames(
    { [styles.interactiveThumb]: onDetail },
    className
  )
  if (mediaObject.localPhoto) {
    return (
      <LocalPhoto
        {...props}
        className={composedClass}
        localPhoto={mediaObject.localPhoto}
        onClick={onClick}
      />
    )
  }
  return null
}

const isValid = (mediaObject) => Boolean(mediaObject.localPhoto)

const ReflessSlideShowGallery = (
  {
    as: Component = 'div',
    className,
    media,
    previewComponent,
    size = 'galleryDecoration',
    square,
    ...props
  },
  ref
) => {
  const validMedia = media.filter(isValid)
  const [activeIndex] = useRotatingIndex(validMedia, 6000)
  return (
    <Component
      className={classnames(className, styles.slideShow, {
        [styles.squareLayout]: square,
      })}
      ref={ref}
      {...props}
    >
      {validMedia.map((mediaObject, index) => (
        <MediaObject
          className={classnames(styles.slideShowThumb, {
            [styles.slideShowCurrent]: activeIndex === index,
          })}
          key={mediaObject.id}
          mediaObject={mediaObject}
          previewComponent={previewComponent}
          size={size}
        />
      ))}
    </Component>
  )
}

export const SlideShowGallery = forwardRef(ReflessSlideShowGallery)

const LightBoxButton = ({ className, icon: Icon, onClick, ...props }) => (
  <Button
    className={classnames(styles.lightboxButton, className)}
    disabled={!onClick}
    onClick={onClick}
    {...props}
  >
    <Icon />
  </Button>
)

const LightBox = ({ mediaObject, onNext, onPrev, onClose, show }) => {
  const { t } = useTranslation()
  const container = useRef(null)
  const handleBackdropClick = (e) =>
    e.target.classList.contains('modal-content') && onClose()

  const handleOpenFocus = () => container.current && container.current.focus()
  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft' && onPrev) {
      onPrev()
    }
    if (e.key === 'ArrowRight' && onNext) {
      onNext()
    }
  }
  return (
    <Modal
      centered
      className={styles.lightbox}
      fullscreen
      onClick={handleBackdropClick}
      onEntered={handleOpenFocus}
      onHide={onClose}
      show={show}
      size="xl"
    >
      <div
        className={styles.lightboxContainer}
        onKeyUp={handleKeyUp}
        ref={container}
        tabIndex={-1}
      >
        <LightBoxButton
          className={styles.lightboxClose}
          icon={CloseIcon}
          onClick={onClose}
          title={t('close')}
        />
        <LightBoxButton
          className={styles.lightboxPrev}
          icon={PrevIcon}
          onClick={onPrev}
          title={t('prev')}
        />
        <LightBoxButton
          className={styles.lightboxNext}
          icon={NextIcon}
          onClick={onNext}
          title={t('next')}
        />
        <MediaObject mediaObject={mediaObject} size="galleryDetail" />
      </div>
    </Modal>
  )
}

export const ThumbGallery = ({
  className,
  media,
  lightbox = true,
  ...props
}) => {
  const [showDetail, setShowDetail] = useState(false)
  const [detail, setDetail] = useState(null)
  const createLightboxOpen = (mediaObject) => () => {
    setDetail(mediaObject)
    setShowDetail(true)
  }
  const currentIndex = media.indexOf(detail)
  const nextObj = media[currentIndex + 1]
  const prevObj = media[currentIndex - 1]
  const handleClose = () => setShowDetail(false)
  const handleNext = nextObj ? () => setDetail(nextObj) : null
  const handlePrev = prevObj ? () => setDetail(prevObj) : null
  return (
    <>
      {lightbox && (
        <LightBox
          mediaObject={detail}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          show={showDetail}
        />
      )}
      <div className={classnames(styles.thumbGallery, className)} {...props}>
        {media.filter(isValid).map((mediaObject) => (
          <MediaObject
            className={styles.thumb}
            key={mediaObject.id}
            mediaObject={mediaObject}
            size="galleryDecoration"
            onDetail={createLightboxOpen(mediaObject)}
          />
        ))}
      </div>
    </>
  )
}

export const PageTopGallery = ({ media }) => {
  if (media.length === 0) {
    return null
  }
  return (
    <Col className={styles.pageTopGalleryContainer} xl={5}>
      <SlideShowGallery
        className={styles.pageTopGallery}
        media={media}
        previewComponent={PreviewDiv}
        size="galleryDetail"
      />
    </Col>
  )
}
