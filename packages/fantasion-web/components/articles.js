import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from './meta'
import { asStatusCodePage } from './references'
import { GenericPage } from './layout'
import { Link } from './links'
import { MarkdownContent } from './content'
import { Heading, ThumbGallery } from './media'

export const ArticleBody = ({ className, text }) => (
  <MarkdownContent className={classnames('mt-3', className)}>
    {text}
  </MarkdownContent>
)

export const ArticleLead = ({ text }) => (
  <ArticleBody className="lead" text={text} />
)

export const ArticleHeading = ({ selfLink, children }) => {
  const content = selfLink ? <Link {...selfLink}>{children}</Link> : children
  return <Heading>{content}</Heading>
}

export const Article = ({
  afterText,
  beforeText,
  description,
  media,
  selfLink,
  text,
  title,
}) => (
  <Container as="article">
    <Row>
      <Col lg={7}>
        <ArticleHeading selfLink={selfLink}>{title}</ArticleHeading>
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
