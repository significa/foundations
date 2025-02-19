"use client";

import {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useIntersectionObserver } from "@/foundations/hooks/use-intersection-observer/use-intersection-observer";
import { useTicker } from "@/foundations/hooks/use-ticker/use-ticker";
import { getCssValueLength } from "@/foundations/utils/dom/get-css-value-length";
import { cn } from "@/lib/utils";

type DurationProp = number | ((contentLength: number) => number);

const getDurationValue = (duration: DurationProp, length: number): number => {
  if (typeof duration === "number") return duration;
  if (typeof duration === "function") return duration(length);
  return 1;
};

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  direction?: "left" | "right" | "up" | "down";
  paused?: boolean;
  duration?: DurationProp;
}

export const Marquee = ({
  direction: propDirection = "left",
  children,
  paused = false,
  duration: propDuration = (l) => l * 0.05,
  style,
  className,
  ...props
}: MarqueeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [numClones, setNumClones] = useState<number>(1);
  const { isIntersecting } = useIntersectionObserver(rootRef);

  const duration = useRef<number>(getDurationValue(propDuration, 0));
  const progress = useRef(0);
  const deferredResizeHandler = useRef<() => void | null>(null);

  useEffect(() => {
    duration.current = getDurationValue(propDuration, 0);
  }, [propDuration]);

  const [axis, direction] = useMemo(() => {
    return [
      propDirection === "up" || propDirection === "down" ? "y" : "x",
      propDirection === "up" || propDirection === "left" ? "normal" : "reverse",
    ];
  }, [propDirection]);

  const ticker = useTicker((timestamp, delta) => {
    if (deferredResizeHandler.current) {
      deferredResizeHandler.current();
      deferredResizeHandler.current = null;
    }

    const root = rootRef.current;
    if (!root) return;
    if (duration.current === 0) return;

    progress.current =
      (progress.current + delta / (duration.current * 1000)) % 1;

    root.style.setProperty("--p", progress.current.toString());
  });

  useEffect(() => {
    if (paused || !isIntersecting) {
      ticker.stop();
    } else if (isIntersecting) {
      ticker.start();
    }
  }, [ticker, paused, isIntersecting]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const content = [...root.children].filter(
      (child) => !child.hasAttribute("data-clone")
    );

    const getLength = (element: HTMLElement) => {
      return element.getBoundingClientRect()[axis === "x" ? "width" : "height"];
    };

    const onResize = () => {
      const rootLength = getLength(root);

      const gapStyle = getComputedStyle(root).gap;
      const gapLength = getCssValueLength(gapStyle);

      const contentLength = content.reduce(
        (acc, item) => acc + getLength(item as HTMLElement),
        0
      );

      duration.current = getDurationValue(propDuration, contentLength);

      const numClones = Math.ceil(rootLength / contentLength);
      setNumClones(numClones);

      root.style.setProperty(
        "--l",
        `${contentLength + gapLength * content.length}px`
      );
    };

    onResize();

    const resizeObserver = new ResizeObserver(() => {
      if (ticker.paused) {
        onResize();
      } else {
        // if ticker is running, defer the resize handler to the next tick
        deferredResizeHandler.current = () => onResize();
      }
    });
    content.forEach((item) => resizeObserver.observe(item));

    return () => {
      resizeObserver.disconnect();
      deferredResizeHandler.current = null;
    };
  }, [children, axis, propDuration, ticker]);

  const transformedChildren = useMemo(() => {
    return Children.map(children, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        return <span className="inline-block">{child}</span>;
      }

      return child;
    });
  }, [children]);

  return (
    <div
      ref={rootRef}
      role="marquee"
      aria-live="off"
      aria-atomic="false"
      {...props}
      className={cn(
        "box-content flex w-max overflow-hidden will-change-transform",
        "[&>*]:shrink-0 [&>*]:will-change-transform",
        axis === "x" && "flex-row [&>*]:translate-x-(--t)",
        axis === "y" && "flex-col [&>*]:translate-y-(--t)",
        className
      )}
      style={{
        ...style,
        "--t": `calc((${direction === "normal" ? "-1 * " : "-1 + "}var(--p,0)) * var(--l,0px))`,
      }}
    >
      {transformedChildren}
      {Array.from({ length: numClones }).map((_, index) =>
        Children.map(transformedChildren, (child) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cloneElement(child as ReactElement<any>, {
            key: index,
            "aria-hidden": "true",
            "data-clone": "",
          })
        )
      )}
    </div>
  );
};
