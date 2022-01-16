import Image from 'next/image'

const Heading = ({ level, children }) => {
  const Component = `h${level}`
  return <Component>{children}</Component>
}

const GalleryPreview = ({ localPhoto }) => (
  <Image alt="" src={localPhoto.galleryPreview} height={256} width={256} />
)

const LocalPhoto = ({ height, width, localPhoto }) => (
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
      <div>{text}</div>
      {media ? <ArticleGallery media={media} /> : null}
    </article>
  )
}
