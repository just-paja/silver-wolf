import Nav from 'react-bootstrap/Nav'
import NextLink from 'next/link'

import { qsm } from 'query-string-manipulator'
import { useTranslation } from 'next-i18next'
import { reverse } from '../routes'

export const Linker = ({ children, href, query, params, route }) => {
  const { i18n } = useTranslation()
  const target = route
    ? qsm(reverse(i18n.resolvedLanguage, route, params), { set: query })
    : href

  return (
    <NextLink href={target} passHref>
      {children}
    </NextLink>
  )
}

const handleExternalClick = (e) => {
  e.preventDefault()
  window.open(e.target.href)
}

export const Link = ({
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
    <Linker href={href} params={params} query={query} route={route}>
      {comp}
    </Linker>
  )
}

export const A = ({ href, children, props, As = 'a' }) => (
  <NextLink href={href} passHref>
    <As {...props}>{children}</As>
  </NextLink>
)

export const NavLink = ({ children, params, route, ...props }) => (
  <Linker route={route} params={params}>
    <Nav.Link {...props}>{children}</Nav.Link>
  </Linker>
)
