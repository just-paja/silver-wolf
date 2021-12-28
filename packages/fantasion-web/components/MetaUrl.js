import { useRouter } from 'next/router'

export const MetaUrl = () => {
  const router = useRouter()
  return <meta property="og:url" content={router.href} />
}
