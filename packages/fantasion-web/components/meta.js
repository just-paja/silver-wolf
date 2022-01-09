import Head from 'next/head'
import React from 'react'

import { useRouter } from 'next/router'

export const MetaBase = () => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta key="viewport" name="viewport" content="width=device-width" />
      <meta key="og:type" property="og:type" content="website" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export const MetaPage = ({ description, title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="description" property="description" content={description} />
    </Head>
  )
}

export const MetaUrl = ({ url }) => (
  <Head>
    <meta key="og:url" property="og:url" content={url} />
  </Head>
)

export const asPage = (PageComp) =>
  function MetaPageWrapper(props) {
    const router = useRouter()
    return (
      <>
        <MetaUrl url={`${props.baseUrl}${router.pathname}`} />
        <PageComp {...props} />
      </>
    )
  }