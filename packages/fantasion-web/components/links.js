import Link from 'next/link'

export const A = ({ href, children, props, As = 'a' }) => (
  <Link href={href} passhref>
    <As {...props}>{children}</As>
  </Link>
)
