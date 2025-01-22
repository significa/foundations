import "../globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import PostHogClient from './providers/PostHogClient'

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
        <PostHogClient>
          <ThemeProvider>{children}</ThemeProvider>
        </PostHogClient>
      </body>
    </html>
  );
}
