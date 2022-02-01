import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from './meta'
import { asStatusCodePage } from './references'
import { GenericPage } from './layout'
import { MarkdownContent } from './content'
import { ThumbGallery } from './media'

export const ArticleBody = ({ className, text }) => (
  <MarkdownContent className={classnames('mt-3', className)}>
    {text}
  </MarkdownContent>
)

export const ArticleLead = ({ text }) => (
  <ArticleBody className="lead" text={text} />
)

export const Article = ({
  afterText,
  beforeText,
  description,
  media,
  text,
  title,
}) => (
  <Container as="article">
    <Row>
      <Col lg={7}>
        <h1>{title}</h1>
        {description ? <ArticleLead text={description} /> : null}
        {beforeText ? <div>{beforeText}</div> : null}
        {text ? <ArticleBody text={text} /> : null}
        {afterText ? <div>{afterText}</div> : null}
      </Col>
      <Col lg={5}>
        <ThumbGallery media={media} />
      </Col>
    </Row>
  </Container>
)

export const StaticArticlePage = asPage(
  asStatusCodePage(({ article }) => (
    <GenericPage>
      <MetaPage title={article.title} description={article.description} />
      <Article
        title={article.title}
        description={article.description}
        media={article.media}
        text={article.text}
      />
    </GenericPage>
  ))
)
