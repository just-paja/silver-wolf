import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'
import { HiMailOpen } from 'react-icons/hi'

const icons = {
  email: HiMailOpen,
  facebook: FaFacebook,
  instagram: FaInstagram,
  tiktok: FaTiktok,
}

const linkToNewWindow = (e) => {
  e.preventDefault()
  window.open(e.currentTarget.href)
}

const SocialIcon = ({ service, link }) => {
  const IconComponent = icons[service]
  return (
    <a href={link} onClick={link.startsWith('http') ? linkToNewWindow : null}>
      <IconComponent />
    </a>
  )
}

export const SocialNetworks = ({ subscribable, ...props }) => {
  return (
    <div {...props}>
      <SocialIcon service="facebook" link="https://fb.com/fantasioncz" />
      <SocialIcon
        service="tiktok"
        link="https://www.tiktok.com/@fantasion_cz"
      />
      <SocialIcon
        service="instagram"
        link="https://www.instagram.com/fantasion_cz/"
      />
      {subscribable ? (
        <SocialIcon service="email" link="mailto:info@fantasion.cz" />
      ) : null}
    </div>
  )
}
