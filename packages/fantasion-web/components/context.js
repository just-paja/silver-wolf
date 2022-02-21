import { createContext, useCallback, useContext, useMemo } from 'react'
import { curryAuth, TOKEN_COOKIE } from '../api'
import { getCookie, setCookies } from 'cookies-next'
import { reverse } from '../routes'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export const HeadingLevelContext = createContext(0)
export const SiteContext = createContext({})

export const useFetch = () => useSite().fetch
export const useHeadingLevel = () => useContext(HeadingLevelContext)
export const useSite = () => useContext(SiteContext)
export const useUser = () => useSite().user

export const SiteContextProvider = ({ children, user }) => {
  const authCookie = getCookie(TOKEN_COOKIE)
  const { i18n } = useTranslation()
  const router = useRouter()
  const lang = i18n.language
  const logout = useCallback(() => {
    setCookies(TOKEN_COOKIE, null, { sameSite: 'strict' })
    router.push(reverse(lang, 'home'))
  }, [user])
  const context = useMemo(
    () => ({
      fetch: curryAuth(authCookie),
      lang,
      logout,
      user,
    }),
    [authCookie, lang, logout, user]
  )
  return <SiteContext.Provider value={context}>{children}</SiteContext.Provider>
}
