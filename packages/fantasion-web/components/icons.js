import { BsPersonFill, BsPinMapFill } from 'react-icons/bs'
import { HiHome, HiMailOpen } from 'react-icons/hi'
import { GiJourney } from 'react-icons/gi'
import {
  MdCancel,
  MdContentCopy,
  MdGppGood,
  MdGppBad,
  MdGppMaybe,
} from 'react-icons/md'
import {
  FaCalendarWeek,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from 'react-icons/fa'

/* These are icon bindings. Make sure that all icons used in the application
 * are here to prevent unnecessary confusion from accidentally using different
 * icon for the same purpose. */

export const CancelIcon = MdCancel
export const CopyIcon = MdContentCopy
export const EmailContactIcon = HiMailOpen
export const DurationIcon = FaCalendarWeek
export const FacebookIcon = FaFacebook
export const HomeIcon = HiHome
export const InsecureIcon = MdGppBad
export const InstagramIcon = FaInstagram
export const LocationPinIcon = BsPinMapFill
export const PersonIcon = BsPersonFill
export const SecureIcon = MdGppGood
export const SecurityWarningIcon = MdGppMaybe
export const StoryIcon = GiJourney
export const TiktokIcon = FaTiktok
export const TwitterIcon = FaTwitter

export const IconLabel = ({ icon: Icon, text }) => (
  <>
    <Icon className="me-1" />
    &nbsp;{text}
  </>
)
