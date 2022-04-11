import styles from './icons.module.scss'

import { BsBasket2Fill, BsPersonFill, BsPinMapFill } from 'react-icons/bs'
import { HiHome, HiMenu, HiMailOpen } from 'react-icons/hi'
import { GiJourney } from 'react-icons/gi'
import { IoPricetags } from 'react-icons/io5'
import {
  MdCancel,
  MdContentCopy,
  MdGppGood,
  MdGppBad,
  MdGppMaybe,
  MdLogout,
} from 'react-icons/md'
import {
  FaCampground,
  FaCalendarWeek,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from 'react-icons/fa'

/* These are icon bindings. Make sure that all icons used in the application
 * are here to prevent unnecessary confusion from accidentally using different
 * icon for the same purpose. */

export const BasketIcon = BsBasket2Fill
export const CancelIcon = MdCancel
export const CopyIcon = MdContentCopy
export const EmailContactIcon = HiMailOpen
export const DurationIcon = FaCalendarWeek
export const FacebookIcon = FaFacebook
export const HamburgerMenuIcon = HiMenu
export const HomeIcon = HiHome
export const InsecureIcon = MdGppBad
export const InstagramIcon = FaInstagram
export const LocationPinIcon = BsPinMapFill
export const LogoutIcon = MdLogout
export const PersonIcon = BsPersonFill
export const PriceIcon = IoPricetags
export const SecureIcon = MdGppGood
export const SecurityWarningIcon = MdGppMaybe
export const SignupIcon = FaCampground
export const StoryIcon = GiJourney
export const TiktokIcon = FaTiktok
export const TwitterIcon = FaTwitter

export const IconLabel = ({ icon: Icon, text }) => (
  <>
    <Icon className="me-1" />
    &nbsp;{text}
  </>
)

export const IconBubble = ({ children, ...props }) => (
  <div className={styles.bubble} {...props}>
    {children}
  </div>
)
