import classnames from 'classnames'
import Col from 'react-bootstrap/Col'

import { useEffect, useState } from 'react'
import { useHeadingLevel } from './context'

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

export const Heading = ({ level, relativeLevel = 0, children }) => {
  const headingLevel = useHeadingLevel()
  const Component = `h${level || headingLevel + (relativeLevel || 1)}`
  return <Component>{children}</Component>
}

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

const MediaObject = ({ mediaObject, ...props }) => {
  if (mediaObject.localPhoto) {
    return <LocalPhoto localPhoto={mediaObject.localPhoto} {...props} />
  }
  return null
}

const isValid = (mediaObject) => {
  return Boolean(mediaObject.localPhoto)
}

export const SlideShowGallery = ({
  className,
  media,
  previewComponent,
  size = 'galleryDecoration',
  square,
  ...props
}) => {
  const validMedia = media.filter(isValid)
  const [activeIndex] = useRotatingIndex(validMedia, 6000)
  return (
    <div
      className={classnames(className, styles.slideShow, {
        [styles.squareLayout]: square,
      })}
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
    </div>
  )
}

export const ThumbGallery = ({ className, media, ...props }) => {
  return (
    <div className={classnames(styles.thumbGallery, className)} {...props}>
      {media.filter(isValid).map((mediaObject) => (
        <MediaObject
          className={styles.thumb}
          key={mediaObject.id}
          mediaObject={mediaObject}
          size="galleryDecoration"
        />
      ))}
    </div>
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
