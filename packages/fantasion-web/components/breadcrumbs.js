import BsBreadcrumb from 'react-bootstrap/Breadcrumb'

import { Linker } from './links'
import { HomeIcon } from './icons'

const Breadcrumb = ({ active, link }) => {
  const inner = (
    <BsBreadcrumb.Item active={active}>{link.children}</BsBreadcrumb.Item>
  )
  if (link.route) {
    return (
      <Linker route={link.route} params={link.params}>
        {inner}
      </Linker>
    )
  }
  return inner
}

export const Breadcrumbs = ({ links }) => (
  <BsBreadcrumb>
    <Linker route="home">
      <BsBreadcrumb.Item>
        <HomeIcon />
      </BsBreadcrumb.Item>
    </Linker>
    {links.map((link, index) => (
      <Breadcrumb active={index === links.length - 1} key={index} link={link} />
    ))}
  </BsBreadcrumb>
)
