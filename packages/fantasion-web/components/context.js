import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { curryAuth, TOKEN_COOKIE } from '../api'
import { getCookie, setCookies } from 'cookies-next'
import { reverse } from '../routes'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export const AlertContext = createContext({})
export const ExpeditionContext = createContext(null)
export const HeadingLevelContext = createContext(0)
export const SiteContext = createContext({})
export const ToastContext = createContext({})

export const useActiveOrder = () => useSite().activeOrder
export const useAlerts = () => useContext(AlertContext)
export const useExpedition = () => useContext(ExpeditionContext)
export const useFetch = () => useSite().fetch
export const useHeadingLevel = () => useContext(HeadingLevelContext)
export const useLang = () => useSite().lang
export const useSetActiveOrder = () => useSite().setActiveOrder
export const useSite = () => useContext(SiteContext)
export const useToasts = () => useContext(ToastContext)
export const useUser = () => useSite().user

export const SiteContextProvider = ({ activeOrder, children, user }) => {
  const [currentOrder, setCurrentOrder] = useState(activeOrder)
  const [once, setOnce] = useState(false)
  const authCookie = getCookie(TOKEN_COOKIE)
  const { i18n } = useTranslation()
  const router = useRouter()
  const lang = i18n.language
  const logout = useCallback(() => {
    setCookies(TOKEN_COOKIE, null, { sameSite: 'strict' })
    router.push(reverse(lang, 'home'))
  }, [lang, router])
  const fetch = curryAuth(authCookie)

  useEffect(() => {
    const query = Object.fromEntries(
      document.location.search
        .substr(1)
        .split('&')
        .map((str) => str.split('=').map(decodeURIComponent))
    )
    if (query.redirectTo) {
      localStorage.setItem('redirectTo', query.redirectTo)
    }
  }, [])

  useEffect(() => {
    if (!currentOrder && !once) {
      fetch('/orders/active').then((o) => {
        setCurrentOrder(o)
        setOnce(true)
      })
    }
  }, [currentOrder, fetch, once])

  const context = useMemo(
    () => ({
      activeOrder: currentOrder,
      fetch,
      lang,
      logout,
      setActiveOrder: setCurrentOrder,
      user,
    }),
    [currentOrder, fetch, lang, logout, setCurrentOrder, user]
  )
  return <SiteContext.Provider value={context}>{children}</SiteContext.Provider>
}
