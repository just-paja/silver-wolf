import { useCallback, useEffect, useState } from 'react'

export const breakpoints = {
  xxl: 1400,
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
  xs: 0,
}

const getBreakpoint = (width) =>
  Object.entries(breakpoints).reduce(
    (aggr, [name, minWidth]) =>
      width > minWidth && minWidth >= breakpoints[aggr] ? name : aggr,
    'xs'
  )

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('xs')

  const onResize = useCallback(() => {
    const nextBreakpoint = getBreakpoint(window.innerWidth)
    if (nextBreakpoint !== breakpoint) {
      setBreakpoint(nextBreakpoint)
    }
  }, [breakpoint])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])
  return [breakpoint, breakpoints[breakpoint]]
}
