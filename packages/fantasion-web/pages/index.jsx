import Head from 'next/head'
import React from 'react'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}

export default function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <Head>
        <title>Fantasion</title>
        <meta name="description" content={t('fantasion-general-description')} />
        <meta charSet="utf-8" />
        <meta property="og:title" content="Fantasion" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fantasion.cz" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Fantasion</h1>
      </main>
    </div>
  )
}
