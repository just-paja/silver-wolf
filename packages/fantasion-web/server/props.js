import getConfig from 'next/config'

import { curryAuth, TOKEN_COOKIE } from '../api'
import { getCookie } from 'cookies-next'
import { NotFound } from '../errors'
import { reverse } from '../routes'
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
      lang: locale,
      user: await getUser(props),
      ...(await serverSideTranslations(locale)),
    },
  }
}

const createFetch = (props) => curryAuth(getAuthCookie(props))

const resolvePropGetter = (fn, props) => fn && fn(props)

const withFetch = (fn) => (props) =>
  fn({
    ...props,
    fetch: createFetch(props),
  })

const defaultProps = {
  statusCode: 200,
}

export const requireUser = (fn) => (props) => {
  if (!props.user) {
    return {
      redirect: {
        destination: `${reverse(
          props.lang,
          'login'
        )}?redirectTo=${encodeURIComponent(props.req.url)}`,
        permanent: false,
      },
    }
  }
  return fn(props)
}

export const withPageProps = (fn) =>
  withFetch(async (props) => {
    try {
      const pageProps = await getPageProps(props)
      const resolvedProps = await resolvePropGetter(fn, {
        ...props,
        ...pageProps.props,
      })
      const result = {
        ...pageProps,
        ...resolvedProps,
        props: {
          ...defaultProps,
          ...pageProps?.props,
          ...resolvedProps?.props,
        },
      }
      if (props.res) {
        props.res.statusCode = result.props.statusCode
      }
      return result
    } catch (error) {
      if (error instanceof NotFound) {
        return {
          notFound: true,
          props: {
            statusCode: 404,
          },
        }
      }
      throw error
    }
  })
