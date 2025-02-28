"use client";

import {
  useEffect,
  useRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";

import { debounce } from "@/foundations/utils/debounce/debounce";
import { sum } from "@/foundations/utils/math/sum";


const px = (value: number) => (isNaN(value) ? undefined : `${value}px`);

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  stick: "top" | "bottom";
  children: ReactElement<typeof StackItem> | ReactElement<typeof StackItem>[];
}

const Stack = ({ stick = "top", children, ...rest }: StackProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = [
      ...root.querySelectorAll('[data-stack="item"]'),
    ] as HTMLElement[];

    const headers = items.map((item) =>
      item.querySelector('[data-stack="header"]')
    ) as HTMLElement[];

    const length = items.length;

    const heights = {
      viewport: 0,
      items: new Array(length).fill(0),
      headers: new Array(length).fill(0),
      contents: new Array(length).fill(0),
      update: () => {
        heights.viewport = window.innerHeight;

        for (let index = 0; index < length; index++) {
          heights.items[index] = items[index].getBoundingClientRect().height;
          heights.headers[index] =
            headers[index]?.getBoundingClientRect().height || 0;
          heights.contents[index] =
            heights.items[index] - heights.headers[index];
        }
      },
    };

    const computeAlignTopBottomMargins = () => {
      const values: number[] = [];

      for (let i = length - 1; i >= 0; i--) {
        values[i] =
          i === length - 1
            ? 0
            : heights.items[i + 1] -
              heights.items[i] +
              heights.headers[i] +
              values[i + 1];
      }

      return values;
    };

    const onResize = debounce(() => {
      heights.update();

      const preComputedMarginBottoms =
        stick === "top" ? computeAlignTopBottomMargins() : [];

      for (let index = 0; index < length; index++) {
        const styles = {
          position: "sticky" as const,
          top: undefined as string | undefined,
          bottom: undefined as string | undefined,
          marginTop: undefined as string | undefined,
          marginBottom: undefined as string | undefined,
        };

        // sum of all headers before the current item
        const preHeaderHeightSum = sum(...heights.headers.slice(0, index));

        if (stick === "top") {
          styles.top = px(preHeaderHeightSum);
          styles.marginBottom = px(preComputedMarginBottoms[index]);
          styles.marginTop = px(
            -1 * (preComputedMarginBottoms[index - 1] || 0)
          );
        }

        if (stick === "bottom") {
          // sum of all headers after the current item
          const subHeaderHeightSum = sum(
            ...heights.headers.slice(index + 1, length)
          );

          styles.bottom = px(
            -1 * (heights.contents[index] - subHeaderHeightSum)
          );
          styles.marginTop = px(preHeaderHeightSum);
          styles.marginBottom = px(
            -1 * (preHeaderHeightSum + heights.headers[index])
          );
        }

        Object.assign(items[index].style, styles);
      }

      if (stick === "bottom") {
        // correct layout deficit create by negative margins
        root.style.paddingBottom = px(sum(...heights.headers)) as string;
      }
    });

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);

    return () => {
      resizeObserver.disconnect();

      // clear styles
      root.style.removeProperty("paddingBottom");
      items.forEach((item) => {
        item.style.removeProperty("position");
        item.style.removeProperty("bottom");
        item.style.removeProperty("top");
        item.style.removeProperty("marginTop");
        item.style.removeProperty("marginBottom");
      });
    };
  }, [stick]);

  return (
    <div {...rest} ref={rootRef} data-stack="root">
      {children}
    </div>
  );
};

interface StackItemProps extends HTMLAttributes<HTMLDivElement> {
  children: [ReactElement<typeof StackHeader>, ...ReactNode[]];
}

const StackItem = ({ children, ...rest }: StackItemProps) => {
  return (
    <div {...rest} data-stack="item">
      {children}
    </div>
  );
};

const StackHeader = ({ children, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...rest} data-stack="header">
      {children}
    </div>
  );
};

export { Stack, StackHeader, StackItem };
