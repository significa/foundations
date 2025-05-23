import "../globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import { PostHogProvider } from "./providers";

export const metadata: Metadata = {
  title: "Foundations by Significa - A base config for digital products.",
  description:
    "Explore Significa Foundations: our design and development principles, methodologies, and tools that ensure every digital product we create is purposeful, accessible, and beautifully built.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PostHogProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
