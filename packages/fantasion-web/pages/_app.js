import Head from 'next/head'

import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import '../styles/globals.css'

function MyApp({ baseUrl, Component, pageProps }) {
  const router = useRouter()
  console.log(baseUrl, pageProps)
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content="Fantasion" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={router.href} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(MyApp)
