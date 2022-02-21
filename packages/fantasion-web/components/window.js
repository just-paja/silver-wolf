import { useCallback, useEffect, useState } from 'react'

export const useOutsideClick = (ref, onClick) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick(event)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClick])
}

export const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollTopMax, setScrollTopMax] = useState(0)
  const [scrolling, setScrolling] = useState(false)

  const onScroll = useCallback(
    (e) => {
      const doc = e.target || e
      setScrollTop(doc.documentElement.scrollTop)
      setScrolling(doc.documentElement.scrollTop > scrollTop)
    },
    [scrollTop, setScrollTop, setScrolling]
  )

  const onResize = useCallback(() => {
    setScrollTopMax(global.document.documentElement.scrollTopMax)
    onScroll(global.document)
  }, [onScroll, setScrollTopMax])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [onScroll, onResize, scrollTop])

  useEffect(() => {
    setScrollTop(global.document.documentElement.scrollTop)
  }, [])

  return [scrollTop, scrollTopMax, scrolling]
}
