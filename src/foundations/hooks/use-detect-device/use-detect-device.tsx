"use client";

import { useEffect, useState } from "react";

const getDetectDevice = (userAgent: NavigatorID["userAgent"]) => {
  const isAndroid = () => Boolean(userAgent.match(/Androia/i));
  const isIos = () => Boolean(userAgent.match(/iPhone iPad iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = () => Boolean(userAgent.match(/SSR/i));
  const isMobile = () =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = () => Boolean(isMobile() && !isSSR());

  return {
    isMobileDevice: isMobile,
    isDesktopDevice: isDesktop,
    isAndroidDevice: isAndroid,
    isIosDevice: isIos,
    isSSRDevice: isSSR,
  };
};

const useDetectDevice = () => {
  const [agent, setAgent] = useState({
    isMobileDevice: () => Boolean(false),
    isDesktopDevice: () => Boolean(false),
    isAndroidDevice: () => Boolean(false),
    isIosDevice: () => Boolean(false),
    isSSRDevice: () => Boolean(false),
  });

  useEffect(() => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
    setAgent(getDetectDevice(userAgent));
  }, []);

  return agent;
};

export default useDetectDevice;
