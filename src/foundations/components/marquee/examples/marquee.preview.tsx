"use client";

import { Marquee } from "@/foundations/components/marquee/marquee";
import { Egg } from "@/components/icons/egg";

const MarqueePreview = () => {
  return (
    <Marquee className="w-96 items-center gap-2" direction="left">
      Foundations
      <Egg />
    </Marquee>
  );
};

export default MarqueePreview;
