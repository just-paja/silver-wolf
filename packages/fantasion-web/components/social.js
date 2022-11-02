import {
  DiscordIcon,
  EmailContactIcon,
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
} from './icons'

const icons = {
  email: EmailContactIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  discord: DiscordIcon,
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
        service="instagram"
        link="https://www.instagram.com/fantasion_cz/"
      />
      <SocialIcon service="discord" link="https://discord.gg/waYz7TAQCz" />
      <SocialIcon
        service="tiktok"
        link="https://www.tiktok.com/@fantasion_tabory"
      />
      {subscribable ? (
        <SocialIcon service="email" link="mailto:info@fantasion.cz" />
      ) : null}
    </div>
  )
}
