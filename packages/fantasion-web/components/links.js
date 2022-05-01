import NextLink from 'next/link'

import { cloneElement } from 'react'
import { qsm } from 'query-string-manipulator'
import { reverse } from '../routes'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export const Linker = ({
  activeProp,
  children,
  href,
  query,
  params,
  route,
}) => {
  const { i18n } = useTranslation()
  const router = useRouter()
  const target = route
    ? qsm(reverse(i18n.resolvedLanguage, route, params), { set: query })
    : href

  let extraProps = null
  if (activeProp) {
    extraProps = {}
    const routerPath = `/${i18n.resolvedLanguage}${router.asPath}`
    extraProps[activeProp] = `${target}/` === routerPath
  }

  return (
    <NextLink href={target} passHref>
      {cloneElement(children, { ...extraProps })}
    </NextLink>
  )
}

const handleExternalClick = (e) => {
  e.preventDefault()
  window.open(e.target.href)
}

export const Link = ({
  activeProp,
  as: As = 'a',
  children,
  external,
  href,
  params,
  query,
  route,
  ...props
}) => {
  const comp = (
    <As {...props} onClick={external && handleExternalClick}>
      {children}
    </As>
  )
  return props.disabled ? (
    comp
  ) : (
    <Linker
      activeProp={activeProp}
      href={href}
      params={params}
      query={query}
      route={route}
    >
      {comp}
    </Linker>
  )
}

export const A = ({ href, children, props, As = 'a' }) => (
  <NextLink href={href} passHref>
    <As {...props}>{children}</As>
  </NextLink>
)
