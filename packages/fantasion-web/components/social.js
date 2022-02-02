import {
  EmailContactIcon,
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  TwitterIcon,
} from './icons'

const icons = {
  email: EmailContactIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  twitter: TwitterIcon,
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
      <SocialIcon service="twitter" link="https://twitter.com/fantasion_cz" />
      <SocialIcon
        service="tiktok"
        link="https://www.tiktok.com/@fantasion_tabory"
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
