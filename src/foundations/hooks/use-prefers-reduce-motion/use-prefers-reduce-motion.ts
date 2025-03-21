'use client'

import React from 'react'

const QUERY = '(prefers-reduced-motion: no-preference)'

export default function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    React.useState<boolean>(false)

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY)

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches)
    }

    mediaQueryList.addEventListener('change', listener)

    return () => {
      mediaQueryList.removeEventListener('change', listener)
    }
  }, [])

  return prefersReducedMotion
}
