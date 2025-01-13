"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  container?: Element;
  children: React.ReactNode;
};

export const Portal = (props: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => setMounted(true), []);

  const container = props.container || (mounted && document.body);

  return container ? createPortal(props.children, container) : null;
};
