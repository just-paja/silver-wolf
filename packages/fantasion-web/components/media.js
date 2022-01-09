const Heading = ({ level, children }) => {
  const Component = `h${level}`
  return <Component>{children}</Component>
}

const LocalPhoto = ({ localPhoto }) => <img src={localPhoto} />

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
