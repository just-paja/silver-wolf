import Container from 'react-bootstrap/Container'
import Error from 'next/error'
import React from 'react'
import Markdown from 'react-markdown'

import { asPage, MetaPage } from '../components/meta'
import { SiteNavbar } from '../components/layout'

export const StaticArticlePage = asPage(({ article, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />
  }
  return (
    <main>
      <MetaPage title={article.title} description={article.description} />
      <SiteNavbar />
      <Container>
        <h1>{article.title}</h1>
        <Markdown>{article.description}</Markdown>
        <Markdown>{article.text}</Markdown>
      </Container>
    </main>
  )
})
