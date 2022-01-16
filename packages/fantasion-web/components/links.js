import Link from 'next/link'

import { useTranslation } from 'next-i18next'
import { reverse } from '../routes'

export const Linker = ({ children, href, route }) => {
  const { i18n } = useTranslation()
  const target = route ? reverse(i18n.resolvedLanguage, route) : href

  return (
    <Link href={target} passHref>
      {children}
    </Link>
  )
}

export const A = ({ href, children, props, As = 'a' }) => (
  <Link href={href} passHref>
    <As {...props}>{children}</As>
  </Link>
)
