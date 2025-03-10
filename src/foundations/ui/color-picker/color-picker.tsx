"use client";
import chroma from "chroma-js";
import React, { useRef } from "react";

import { cn } from "@/lib/utils";

export type HSV = [number, number, number];

export type ColorPickerProps = Omit<
  React.InputHTMLAttributes<HTMLDivElement>,
  "color"
> & {
  color?: HSV;
  onColorChange?: (color: HSV) => void;
  size?: number;
};

const HANDLE_SIZE_RADIUS = 8;

const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      className,
      disabled,
      color = [0, 1, 1],
      onColorChange,
      size = 254,
      ...props
    },
    ref
  ) => {
    const [h, s, v] = color;

    const onSaturationValueChange = ([x, y]: [number, number]) => {
      onColorChange?.([h, x / size, 1 - y / size]);
    };

    const onHueChange = ([x]: [number, number]) => {
      onColorChange?.([(x / size) * 360, s, v]);
    };

    return (
      <div
        className={cn(disabled && "pointer-events-none opacity-48", className)}
        ref={ref}
        {...props}
      >
        <Draggable
          onMove={onSaturationValueChange}
          keyMap={{
            up: (modifierKey) => {
              onColorChange?.([
                h,
                s,
                Math.min(1, v + (modifierKey ? 0.1 : 0.02)),
              ]);
            },
            down: (modifierKey) => {
              onColorChange?.([
                h,
                s,
                Math.max(0, v - (modifierKey ? 0.1 : 0.02)),
              ]);
            },
            left: (modifierKey) => {
              onColorChange?.([
                h,
                Math.max(0, s - (modifierKey ? 0.1 : 0.02)),
                v,
              ]);
            },
            right: (modifierKey) => {
              onColorChange?.([
                h,
                Math.min(1, s + (modifierKey ? 0.1 : 0.02)),
                v,
              ]);
            },
          }}
          disabled={disabled}
          size={size}
          style={{
            height: `${size}px`,
            width: `${size}px`,
            backgroundColor: chroma(h, 1, 1, "hsv").css(),
            backgroundImage: `linear-gradient(transparent, black),
            linear-gradient(to right, white, transparent)`,
          }}
        >
          <ColorHandle color={color} top={1 - v} left={s} />
        </Draggable>
        <Draggable
          onMove={onHueChange}
          keyMap={{
            left: (modifierKey) => {
              onColorChange?.([Math.max(0, h - (modifierKey ? 10 : 2)), s, v]);
            },
            right: (modifierKey) => {
              onColorChange?.([
                Math.min(360, h + (modifierKey ? 10 : 2)),
                s,
                v,
              ]);
            },
          }}
          className="mt-4"
          disabled={disabled}
          size={size}
          style={{
            height: `${HANDLE_SIZE_RADIUS * 2}px`,
            width: `${size}px`,
            background:
              "linear-gradient(90deg, hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%), hsl(90, 100%, 50%), hsl(120, 100%, 50%), hsl(150, 100%, 50%), hsl(180, 100%, 50%), hsl(210, 100%, 50%), hsl(240, 100%, 50%), hsl(270, 100%, 50%),hsl(300, 100%, 50%), hsl(330, 100%, 50%), hsl(360, 100%, 50%))",
          }}
        >
          <ColorHandle color={[h, 1, 1]} left={h / 360} />
        </Draggable>
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

interface DraggableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  onMove: (coords: [number, number]) => void;
  keyMap: Partial<
    Record<"up" | "down" | "left" | "right", (modifierKey: boolean) => void>
  >;
  disabled?: boolean;
  size: number;
}

const Draggable = ({
  disabled,
  className,
  onMove,
  keyMap,
  size,
  ...props
}: DraggableProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isSelecting = useRef(false);

  const handleStart = (
    e:
      | MouseEvent
      | TouchEvent
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    if (disabled || !ref.current) return;

    // check if the click was on the boardRef or handleRef
    const el = ref.current;
    if (!el.contains(e.target as Node)) return;

    if (e.cancelable) e.preventDefault();

    // start drag
    isSelecting.current = true;

    // listen to events anywhere in the window to allow the user to stop the drag outside of the picker
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("mouseup", handleStop);
    window.addEventListener("touchend", handleStop);

    // move the handle to the correct position
    onMove(getCoordinatesFromEvent(e));
  };

  const handleStop = () => {
    isSelecting.current = false;

    window.removeEventListener("mouseup", handleStop);
    window.removeEventListener("touchend", handleStop);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isSelecting.current) return;

    if (e.cancelable) e.preventDefault();

    onMove(getCoordinatesFromEvent(e));
  };

  // handler for both mouse and touch events that calculates the correct X and Y within the board
  const getCoordinatesFromEvent = (
    e:
      | MouseEvent
      | TouchEvent
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    const rect = ref.current?.getBoundingClientRect();

    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;

    const x = clientX - (rect?.left || 0);
    const y = clientY - (rect?.top || 0);

    return [Math.min(Math.max(x, 0), size), Math.min(Math.max(y, 0), size)] as [
      number,
      number,
    ];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const key = e.key.toLowerCase();
    const modifierKey = e.shiftKey || e.metaKey;

    if (key === "arrowup" && keyMap.up) {
      e.preventDefault();
      keyMap.up(modifierKey);
    } else if (key === "arrowdown" && keyMap.down) {
      e.preventDefault();
      keyMap.down(modifierKey);
    } else if (key === "arrowleft" && keyMap.left) {
      e.preventDefault();
      keyMap.left(modifierKey);
    } else if (key === "arrowright" && keyMap.right) {
      e.preventDefault();
      keyMap.right(modifierKey);
    }
  };

  return (
    <div
      ref={ref}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative cursor-pointer touch-none rounded-md ring-0",
        className
      )}
      tabIndex={0}
      {...props}
    />
  );
};

interface ColorHandleProps {
  color: HSV;
  left: number;
  top?: number;
}

const ColorHandle = ({
  color,
  left,
  top = 0.5, // start at the vertical middle
}: ColorHandleProps) => {
  return (
    <div
      className={cn(
        "absolute h-[var(--size)] w-[var(--size)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[var(--color)] shadow-lg",
        "transition-transform group-focus:scale-110 group-focus:outline group-focus:outline-4 group-focus:outline-[white]/40"
      )}
      style={{
        "--size": `${HANDLE_SIZE_RADIUS * 2}px`,
        "--color": chroma.hsv(...color).css(),
        left: `${left * 100}%`,
        top: `${top * 100}%`,
      }}
    ></div>
  );
};

export { ColorPicker };
