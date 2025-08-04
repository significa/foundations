/// <reference types="vite/client" />

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import style from "../globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: style }],
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Foundations by Significa - A base config for digital products.",
        description:
          "Explore Significa Foundations: our design and development principles, methodologies, and tools that ensure every digital product we create is purposeful, accessible, and beautifully built.",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
