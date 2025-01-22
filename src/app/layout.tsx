import "../globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { PostHogProvider } from 'posthog-js/react'
import dynamic from 'next/dynamic'

const PostHogPageView = dynamic(() => import('../lib/PostHogPageView'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "Foundations",
  description: "Significa documentation for building applications",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PostHogProvider 
          apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY || ''}
          options={{
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',        
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
          <PostHogPageView />
          <ThemeProvider>{children}</ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
