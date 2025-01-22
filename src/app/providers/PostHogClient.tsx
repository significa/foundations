'use client'

import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || ''
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

export default function PostHogClient({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (pathname) {
      const url = window.origin + pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      // PostHog will be available through the provider
      window.posthog?.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return (
    <PostHogProvider 
      apiKey={posthogKey}
      options={{
        api_host: posthogHost,        
        capture_pageview: false, // We'll capture manually      
        autocapture: true,
        persistence: 'localStorage',
        mask_all_text: true,
        enable_heatmaps: true,     
        capture_pageleave: true,        
        person_profiles: 'always',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        },
      }}
    >
      {children}
    </PostHogProvider>
  )
}
