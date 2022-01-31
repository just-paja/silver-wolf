import getConfig from 'next/config'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const { publicRuntimeConfig } = getConfig()

const origin = `https://${publicRuntimeConfig.baseDomain}`

export const getPageProps = async ({ locale }) => {
  return {
    props: {
      origin,
      baseUrl: `${origin}/${locale}`,
      ...(await serverSideTranslations(locale)),
    },
  }
}
