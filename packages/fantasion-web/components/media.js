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

const GalleryPreview = ({ localPhoto, ...props }) => (
  <div {...props}>
    <Image
      layout="responsive"
      alt=""
      src={localPhoto.galleryPreview}
      height={512}
      width={512}
    />
  </div>
)

const LocalPhoto = ({ localPhoto, ...props }) => (
  <GalleryPreview localPhoto={localPhoto} {...props} />
)

const MediaObject = ({ mediaObject, ...props }) => (
  <LocalPhoto localPhoto={mediaObject.localPhoto} {...props} />
)

export const SlideShowGallery = ({ media, ...props }) => {
  const [activeIndex] = useRotatingIndex(media, 24000)
  return (
    <div className={styles.slideShow} {...props}>
      {media.map((mediaObject, index) => (
        <MediaObject
          className={classnames(styles.slideShowThumb, {
            [styles.slideShowCurrent]: activeIndex === index,
          })}
          key={mediaObject.id}
          mediaObject={mediaObject}
        />
      ))}
    </div>
  )
}
