"use client";

import { useEffect, useState } from "react";

type DeviceInfo = {
  isMobileDevice: boolean;
  isDesktopDevice: boolean;
  isAndroidDevice: boolean;
  isIosDevice: boolean;
};

const getDetectDevice = (userAgent: NavigatorID["userAgent"]): DeviceInfo => {
  const isAndroid = /Android/.test(userAgent);
  const isIos = /iPad|iPhone/.test(userAgent);
  const isMobile = isAndroid || isIos;
  const isDesktop = !isMobile;

  return {
    isMobileDevice: isMobile,
    isDesktopDevice: isDesktop,
    isAndroidDevice: isAndroid,
    isIosDevice: isIos,
  };
};

const useDetectDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobileDevice: false,
    isDesktopDevice: false,
    isAndroidDevice: false,
    isIosDevice: false,
  });

  useEffect(() => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
    setDeviceInfo(getDetectDevice(userAgent));
  }, []);

  return deviceInfo;
};

export default useDetectDevice;
