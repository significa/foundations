"use client";

import usePrefersReducedMotion from "../use-prefers-reduced-motion";

const UserPrefersReducedMotionPreview = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <video autoPlay={!prefersReducedMotion} controls className="h-full w-full">
      <source
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
};

export default UserPrefersReducedMotionPreview;
