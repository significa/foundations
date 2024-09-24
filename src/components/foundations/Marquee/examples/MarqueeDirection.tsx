import { Marquee } from 'components/foundations/Marquee';

export function MarqueeDirection() {
  return (
    <div className="w-full flex flex-col gap-1 text-lg">
      <Marquee dir="ltr" autofill>
        <span className="whitespace-pre text-md"> Hello </span>
      </Marquee>
      <Marquee dir="rtl" autofill>
        <span className="whitespace-pre text-md"> World </span>
      </Marquee>
    </div>
  );
}
