import getConfig from 'next/config'

import { NotFound } from '../api'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const { publicRuntimeConfig } = getConfig()

const origin = `https://${publicRuntimeConfig.baseDomain}`
const defaultLang = publicRuntimeConfig.defaultLang

const determineLocale = (locale) =>
  !locale || locale === 'default' ? defaultLang : locale

export const getPageProps = async (props) => {
  const locale = determineLocale(props.locale)
  return {
    props: {
      origin,
      baseUrl: `${origin}/${locale}`,
      ...(await serverSideTranslations(locale)),
    },
  }
}

const resolveInnerProps = async (resolver, props) => {
  try {
    return await resolver(props)
  } catch (error) {
    if (error instanceof NotFound) {
      return {
        props: {
          statusCode: 404,
        },
      }
    }
    return {
      props: {
        statusCode: 500,
      },
    }
  }
}

export const withPageProps = (fn) => async (props) => ({
  props: {
    statusCode: 200,
    ...(await resolveInnerProps(fn, props)).props,
    ...(await getPageProps(props)).props,
  },
})
