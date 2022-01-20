import Image from 'next/image'
import Markdown from 'react-markdown'

const Heading = ({ level, children }) => {
  const Component = `h${level}`
  return <Component>{children}</Component>
}

const GalleryPreview = ({ localPhoto }) => (
  <Image alt="" src={localPhoto.galleryPreview} height={256} width={256} />
)

const LocalPhoto = ({ localPhoto }) => (
  <GalleryPreview localPhoto={localPhoto} />
)

const MediaObject = ({ mediaObject }) => <LocalPhoto {...mediaObject} />

const ArticleGallery = ({ media }) => {
  return (
    <>
      {media.map((mediaObject) => (
        <MediaObject key={mediaObject.id} mediaObject={mediaObject} />
      ))}
    </>
  )
}

export const Article = ({ level = 1, title, text, media }) => {
  return (
    <article>
      <Heading level={level}>{title}</Heading>
      <div>
        <Markdown>{text}</Markdown>
      </div>
      {media ? <ArticleGallery media={media} /> : null}
    </article>
  )
}
