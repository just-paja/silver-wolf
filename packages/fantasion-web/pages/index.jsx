import getAbsoluteUrl from 'next-absolute-url'
import Head from 'next/head'
import React from 'react'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    baseUrl: getAbsoluteUrl(req),
    ...(await serverSideTranslations(locale)),
  },
})

export default function Home(props) {
  console.log(props)
  const { t } = useTranslation()
  return (
    <div>
      <Head>
        <title>Fantasion</title>
        <meta name="description" content={t('fantasion-general-description')} />
        <meta property="og:title" content="Fantasion" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fantasion.cz" />
      </Head>
      <main>
        <h1>Fantasion</h1>
      </main>
    </div>
  )
}
