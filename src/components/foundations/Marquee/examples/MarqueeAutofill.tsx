import { Marquee } from 'components/foundations/Marquee';

export function MarqueeAutofill() {
  return (
    <div className="w-full flex flex-col gap-1 text-lg">
      <Marquee autofill>
        <div className="text-md whitespace-pre">Short word. </div>
      </Marquee>
      <div className="text-sm text-primary/40">
        Autofill clones your children to fit the width of the container and create a seamless loop
      </div>
    </div>
  );
}
