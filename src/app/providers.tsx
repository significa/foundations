"use client";

import { SuspendedPostHogPageView } from "@/components/posthog-page-view";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST } = process.env;

  useEffect(() => {
    if (NEXT_PUBLIC_POSTHOG_KEY && NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: NEXT_PUBLIC_POSTHOG_HOST,
        ui_host: "https://eu.posthog.com",
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        autocapture: true,
        persistence: "localStorage",
        mask_all_text: true,
        enable_heatmaps: true,
        capture_pageleave: true,
        person_profiles: "always",
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
      });
    }
  }, [NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST]);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
};
