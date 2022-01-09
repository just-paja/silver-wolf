import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const origin = 'https://fantasion.cz'

export const getPageProps = async ({ locale }) => {
  return {
    props: {
      origin,
      baseUrl: `${origin}/${locale}`,
      ...(await serverSideTranslations(locale)),
    },
  }
}
