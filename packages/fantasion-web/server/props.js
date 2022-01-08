import getAbsoluteUrl from 'next-absolute-url'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getPageProps = async ({ locale, req }) => {
  const absUrl = getAbsoluteUrl(req)
  return {
    props: {
      origin: absUrl.origin,
      href: `${absUrl.origin}/${locale}${req.url}`,
      ...(await serverSideTranslations(locale)),
    },
  }
}
