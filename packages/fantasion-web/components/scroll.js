import { useEffect, useState } from 'react'

export const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop)
      setScrolling(e.target.documentElement.scrollTop > scrollTop)
    }
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollTop])

  return [scrollTop, scrolling]
}
