"use client";

import { Marquee } from "@/foundations/components/marquee/marquee";
import { useState } from "react";
import { Egg } from "@/components/icons/egg";

const MarqueePreview = () => {
  const [duration, setDuration] = useState(1);

  return (
    <Marquee
      className="w-96 items-center gap-2"
      direction="left"
      duration={duration}
      onMouseEnter={() => setDuration(2)}
      onMouseLeave={() => setDuration(1)}
    >
      Foundations
      <Egg />
    </Marquee>
  );
};

export default MarqueePreview;
