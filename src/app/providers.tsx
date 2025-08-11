"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

import { SuspendedPostHogPageView } from "@/components/posthog-page-view";

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
        ui_host: "https://eu.posthog.com",
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        autocapture: true,
        persistence: "localStorage",
        mask_all_text: true,
        enable_heatmaps: true,
        capture_pageleave: true,
        person_profiles: "always",
        disable_compression: true,
        loaded: (posthog) => {
          // if (process.env.NODE_ENV === "development") posthog.debug();
          posthog.debug(false);
        },
      });
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.log("No PostHog key found");
    return <>{children}</>;
  } else {
    console.log("PostHog key found");
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
};
