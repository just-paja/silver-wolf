import Container from 'react-bootstrap/Container'
import Error from 'next/error'
import React from 'react'
import Markdown from 'react-markdown'

import { asPage, MetaPage } from './meta'
import { GenericPage } from './layout'

export const StaticArticlePage = asPage(({ article, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />
  }
  return (
    <GenericPage>
      <MetaPage title={article.title} description={article.description} />
      <Container>
        <h1>{article.title}</h1>
        <Markdown>{article.description}</Markdown>
        <Markdown>{article.text}</Markdown>
      </Container>
    </GenericPage>
  )
})
