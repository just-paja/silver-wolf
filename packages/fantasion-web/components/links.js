import NextLink from 'next/link'

import { useTranslation } from 'next-i18next'
import { reverse } from '../routes'

export const Linker = ({ children, href, route }) => {
  const { i18n } = useTranslation()
  const target = route ? reverse(i18n.resolvedLanguage, route) : href

  return (
    <NextLink href={target} passHref>
      {children}
    </NextLink>
  )
}

export const Link = ({ children, href, route }) => (
  <Linker href={href} route={route}>
    <a>{children}</a>
  </Linker>
)

export const A = ({ href, children, props, As = 'a' }) => (
  <NextLink href={href} passHref>
    <As {...props}>{children}</As>
  </NextLink>
)
