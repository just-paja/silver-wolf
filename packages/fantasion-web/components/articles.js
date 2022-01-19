import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Error from 'next/error'
import React from 'react'
import Markdown from 'react-markdown'

import { asPage, MetaPage } from './meta'
import { GenericPage } from './layout'

const GalleryPhoto = ({ mediaObject }) => {
  return (
    <Image
      src={mediaObject.localPhoto.galleryPreview}
      alt={mediaObject.description}
      width={256}
      height={256}
    />
  )
}

const GalleryMediaObject = ({ mediaObject }) => {
  if (mediaObject.localPhoto || mediaObject.privatePhoto) {
    return <GalleryPhoto mediaObject={mediaObject} />
  }
  return null
}

const ArticleGallery = ({ media }) =>
  media.map((item) => <GalleryMediaObject mediaObject={item} key={item.id} />)

export const StaticArticlePage = asPage(({ article, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />
  }
  return (
    <GenericPage>
      <MetaPage title={article.title} description={article.description} />
      <Container>
        <Row>
          <Col lg={7}>
            <h1>{article.title}</h1>
            <Markdown>{article.description}</Markdown>
            <Markdown>{article.text}</Markdown>
          </Col>
          <Col lg={5}>
            <ArticleGallery media={article.media} />
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
})
