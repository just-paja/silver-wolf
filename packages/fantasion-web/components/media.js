import classnames from 'classnames'
import Image from 'next/image'

import { useEffect, useState } from 'react'

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

export const Heading = ({ level = 1, children }) => {
  const Component = `h${level}`
  return <Component>{children}</Component>
}

const dimensions = {
  galleryPreview: [512, 512],
  galleryThumb: [256, 256],
}

const GalleryPreview = ({ layout, localPhoto, size, ...props }) => {
  const [width, height] = dimensions[size]
  return (
    <div {...props}>
      <Image
        layout={layout}
        alt=""
        src={localPhoto[size]}
        height={height}
        width={width}
      />
    </div>
  )
}

const LocalPhoto = ({ localPhoto, ...props }) => (
  <GalleryPreview localPhoto={localPhoto} {...props} />
)

const MediaObject = ({ mediaObject, ...props }) => {
  if (mediaObject.localPhoto) {
    return <LocalPhoto localPhoto={mediaObject.localPhoto} {...props} />
  }
  return null
}

const isValid = (mediaObject) => {
  return Boolean(mediaObject.localPhoto)
}

export const SlideShowGallery = ({ media, ...props }) => {
  const validMedia = media.filter(isValid)
  const [activeIndex] = useRotatingIndex(validMedia, 24000)
  return (
    <div className={styles.slideShow} {...props}>
      {validMedia.map((mediaObject, index) => (
        <MediaObject
          className={classnames(styles.slideShowThumb, {
            [styles.slideShowCurrent]: activeIndex === index,
          })}
          key={mediaObject.id}
          mediaObject={mediaObject}
          layout="responsive"
          size="galleryPreview"
        />
      ))}
    </div>
  )
}

export const ThumbGallery = ({ media, ...props }) => {
  return (
    <div className={styles.thumbGallery} {...props}>
      {media.filter(isValid).map((mediaObject) => (
        <MediaObject
          className={styles.thumb}
          key={mediaObject.id}
          mediaObject={mediaObject}
          size="galleryThumb"
        />
      ))}
    </div>
  )
}
