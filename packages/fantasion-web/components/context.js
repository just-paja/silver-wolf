import { createContext, useContext, useMemo } from 'react'
import { curryAuth, TOKEN_COOKIE } from '../api'
import { getCookie } from 'cookies-next'

export const HeadingLevelContext = createContext(0)
export const SiteContext = createContext({})

export const useFetch = () => useSite().fetch
export const useHeadingLevel = () => useContext(HeadingLevelContext)
export const useSite = () => useContext(SiteContext)
export const useUser = () => useSite().user

export const SiteContextProvider = ({ children, user }) => {
  const authCookie = getCookie(TOKEN_COOKIE)
  const context = useMemo(
    () => ({
      fetch: curryAuth(authCookie),
      user,
    }),
    [authCookie, user]
  )
  return <SiteContext.Provider value={context}>{children}</SiteContext.Provider>
}
