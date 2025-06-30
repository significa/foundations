"use client";

import { useEffect, useState } from "react";

type useDetectDevidePorps = {
  isMobile: boolean;
  isDesktop: boolean;
  isAndroid: boolean;
  isIos: boolean;
};

const getDetectDevice = (
  userAgent: NavigatorID["userAgent"]
): useDetectDevidePorps => {
  const isAndroid = /Android/.test(userAgent);
  const isIos = /iPad|iPhone/.test(userAgent);
  const isMobile = isAndroid || isIos;
  const isDesktop = !isMobile;

  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
  };
};

const useDetectDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState<useDetectDevidePorps>({
    isMobile: false,
    isDesktop: false,
    isAndroid: false,
    isIos: false,
  });

  useEffect(() => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
    setDeviceInfo(getDetectDevice(userAgent));
  }, []);

  return deviceInfo;
};

export default useDetectDevice;
