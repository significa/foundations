import { Textarea } from "../textarea";

export default function TextareaDisabledPreview() {
  return (
    <Textarea
      className="w-80"
      rows={5}
      disabled
      value="Once upon a time, in a distant galaxy, there lived a lonely star. Each day it would shine brightly, hoping to catch the attention of passing comets. One day, a beautiful comet noticed its radiant glow and decided to orbit nearby. From that day forward, the star was never lonely again."
    />
  );
}
