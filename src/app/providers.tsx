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
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      ui_host: "https://eu.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
};
