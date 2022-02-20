import getConfig from 'next/config'

import { curryAuth, NotFound } from '../api'
import { getCookie } from 'cookies-next'
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

const createFetch = (props) =>
  curryAuth(
    getCookie('X-Auth-Token', {
      req: props.req,
      res: props.res,
    })
  )

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

const withFetch = (fn) => async (props) =>
  await fn({
    ...props,
    fetch: createFetch(props),
  })

export const withPageProps = (fn) =>
  withFetch(async (props) => {
    const result = {
      props: {
        statusCode: 200,
        ...(fn ? (await resolveInnerProps(fn, props)).props : {}),
        ...(await getPageProps(props)).props,
      },
    }
    if (props.res) {
      props.res.statusCode = result.props.statusCode
    }
    return result
  })
