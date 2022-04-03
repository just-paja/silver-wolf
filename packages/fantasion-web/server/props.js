import getConfig from 'next/config'

import { curryAuth, NotFound, TOKEN_COOKIE } from '../api'
import { getCookie } from 'cookies-next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const { publicRuntimeConfig } = getConfig()

const origin = `https://${publicRuntimeConfig.baseDomain}`
const defaultLang = publicRuntimeConfig.defaultLang

const determineLocale = (locale) =>
  !locale || locale === 'default' ? defaultLang : locale

const getAuthCookie = (props) =>
  getCookie(TOKEN_COOKIE, {
    req: props.req,
    res: props.res,
  })

const getUser = async (props) =>
  props.fetch.authorized ? props.fetch('/users/me') : null

const getPageProps = async (props) => {
  const locale = determineLocale(props.locale)
  return {
    props: {
      origin,
      baseUrl: `${origin}/${locale}`,
      user: await getUser(props),
      ...(await serverSideTranslations(locale)),
    },
  }
}

const createFetch = (props) => curryAuth(getAuthCookie(props))

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

const withFetch = (fn) => (props) =>
  fn({
    ...props,
    fetch: createFetch(props),
  })

export const withPageProps = (fn) =>
  withFetch(async (props) => {
    const data = await Promise.all(
      [getPageProps(props), fn && resolveInnerProps(fn, props)].filter(Boolean)
    )
    const defaultProps = {
      statusCode: 200,
    }
    const result = {
      props: Object.assign(defaultProps, ...data.map((d) => d.props)),
    }
    if (props.res) {
      props.res.statusCode = result.props.statusCode
    }
    return result
  })
