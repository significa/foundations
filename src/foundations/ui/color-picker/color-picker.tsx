"use client";

import chroma from "chroma-js";
import { createContext, use, useMemo, useRef } from "react";

import { composeRefs } from "@/foundations/utils/compose-refs/compose-refs";
import { cn } from "@/lib/utils";

type HSVA = [number, number, number, number];

interface ColorPickerContextType {
  color: HSVA;
  onChange?: (color: HSVA) => void;
  disabled?: boolean;
}

const ColorPickerContext = createContext<ColorPickerContextType | null>(null);

const useColorPickerContext = () => {
  const context = use(ColorPickerContext);

  if (!context) {
    throw new Error("ColorPicker components must be used within a ColorPicker");
  }

  return context;
};

interface ColorPickerProps
  extends Omit<React.ComponentPropsWithRef<"div">, "color" | "onChange"> {
  color?: HSVA;
  onColorChange?: (color: HSVA) => void;
  disabled?: boolean;
}

const HANDLE_SIZE_RADIUS = 10;

const ColorPicker = ({
  children,
  color = [0, 1, 1, 1],
  onColorChange,
  disabled,
  className,
  ref,
  ...props
}: ColorPickerProps) => {
  const contextValue = useMemo(
    () => ({
      color,
      onChange: onColorChange,
      disabled,
    }),
    [color, onColorChange, disabled]
  );

  return (
    <ColorPickerContext value={contextValue}>
      <div
        ref={ref}
        className={cn(disabled && "pointer-events-none opacity-48", className)}
        {...props}
      >
        {children}
      </div>
    </ColorPickerContext>
  );
};

interface DraggableProps extends React.ComponentPropsWithRef<"div"> {
  onMove: (coords: [number, number]) => void;
  keyMap?: Partial<
    Record<"up" | "down" | "left" | "right", (modifierKey: boolean) => void>
  >;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-valuetext"?: string;
  "aria-valuenow"?: number;
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
}

const Draggable = ({
  disabled,
  className,
  onMove,
  keyMap = {},
  children,
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  "aria-valuenow": ariaValueNow,
  "aria-valuemin": ariaValueMin = 0,
  "aria-valuemax": ariaValueMax = 100,
  ref,
  ...props
}: DraggableProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const isSelecting = useRef(false);

  const handleStart = (
    e:
      | MouseEvent
      | TouchEvent
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    if (disabled || !internalRef.current) return;

    const el = internalRef.current;
    if (!el.contains(e.target as Node)) return;

    if (e.cancelable) e.preventDefault();

    isSelecting.current = true;

    window.addEventListener("mousemove", handleMove, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleStop);
    window.addEventListener("touchend", handleStop);

    onMove(getCoordinatesFromEvent(e));
  };

  const handleStop = () => {
    isSelecting.current = false;

    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("touchmove", handleMove);
    window.removeEventListener("mouseup", handleStop);
    window.removeEventListener("touchend", handleStop);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isSelecting.current) return;

    if (e.cancelable) e.preventDefault();

    onMove(getCoordinatesFromEvent(e));
  };

  const getCoordinatesFromEvent = (
    e:
      | MouseEvent
      | TouchEvent
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    const rect = internalRef.current?.getBoundingClientRect();

    if (!rect) return [0, 0] as [number, number];

    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return [
      Math.min(Math.max(x, 0), rect.width),
      Math.min(Math.max(y, 0), rect.height),
    ] as [number, number];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const key = e.key.toLowerCase();
    const modifierKey = e.shiftKey || e.metaKey;

    if (key === "arrowup" && keyMap?.up) {
      e.preventDefault();
      keyMap.up(modifierKey);
    } else if (key === "arrowdown" && keyMap?.down) {
      e.preventDefault();
      keyMap.down(modifierKey);
    } else if (key === "arrowleft" && keyMap?.left) {
      e.preventDefault();
      keyMap.left(modifierKey);
    } else if (key === "arrowright" && keyMap?.right) {
      e.preventDefault();
      keyMap.right(modifierKey);
    }
  };

  return (
    <div
      ref={composeRefs(internalRef, ref)}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative cursor-pointer touch-none rounded-xl",
        "focus-visible:ring-accent-element focus-visible:ring-4",
        className
      )}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-label={ariaLabel}
      aria-valuetext={ariaValueText}
      aria-valuenow={ariaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
};

interface ColorPickerHandleProps {
  color: HSVA;
  left: number;
  top?: number;
}

const ColorPickerHandle = ({
  color,
  left,
  top = 0.5,
}: ColorPickerHandleProps) => {
  return (
    <div
      className={cn(
        "absolute h-[var(--size)] w-[var(--size)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[var(--color)] shadow-lg",
        "transition-transform group-focus-visible:scale-110 group-focus-visible:outline-4 group-focus-visible:outline-[white]/40"
      )}
      style={{
        "--size": `${HANDLE_SIZE_RADIUS * 2}px`,
        "--color": chroma.hsv(color[0], color[1], color[2]).css(),
        left: `${left * 100}%`,
        top: `${top * 100}%`,
      }}
    />
  );
};

const ColorPickerArea = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const {
    color: [h, s, v, a],
    onChange,
    disabled,
  } = useColorPickerContext();

  const internalRef = useRef<HTMLDivElement>(null);

  const onMove = ([x, y]: [number, number]) => {
    const rect = internalRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = x / rect.width;
    const normalizedY = 1 - y / rect.height;
    onChange?.([h, normalizedX, normalizedY, a]);
  };

  const keyMap = {
    up: (modifierKey: boolean) =>
      onChange?.([h, s, Math.min(1, v + (modifierKey ? 0.1 : 0.02)), a]),
    down: (modifierKey: boolean) =>
      onChange?.([h, s, Math.max(0, v - (modifierKey ? 0.1 : 0.02)), a]),
    left: (modifierKey: boolean) =>
      onChange?.([h, Math.max(0, s - (modifierKey ? 0.1 : 0.02)), v, a]),
    right: (modifierKey: boolean) =>
      onChange?.([h, Math.min(1, s + (modifierKey ? 0.1 : 0.02)), v, a]),
  };

  const ariaValueText = `Saturation ${Math.round(s * 100)}%, Value ${Math.round(v * 100)}%`;

  return (
    <Draggable
      ref={composeRefs(internalRef, ref)}
      onMove={onMove}
      keyMap={keyMap}
      disabled={disabled}
      aria-label="Saturation and value"
      aria-valuetext={ariaValueText}
      aria-valuenow={Math.round(((s + v) / 2) * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("aspect-square w-full", className)}
      style={{
        backgroundColor: chroma(h, 1, 1, "hsv").css(),
        backgroundImage: `linear-gradient(transparent, black),
        linear-gradient(to right, white, transparent)`,
      }}
      {...props}
    >
      <ColorPickerHandle color={[h, s, v, a]} top={1 - v} left={s} />
    </Draggable>
  );
};

const ColorPickerHue = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const {
    color: [h, s, v, a],
    onChange,
    disabled,
  } = useColorPickerContext();

  const internalRef = useRef<HTMLDivElement>(null);

  const onMove = ([x]: [number, number]) => {
    const rect = internalRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = x / rect.width;
    const newH = normalizedX * 360;
    onChange?.([newH, s, v, a]);
  };

  const keyMap = {
    left: (modifierKey: boolean) => {
      const newH = Math.max(0, h - (modifierKey ? 10 : 2));
      onChange?.([newH, s, v, a]);
    },
    right: (modifierKey: boolean) => {
      const newH = Math.min(360, h + (modifierKey ? 10 : 2));
      onChange?.([newH, s, v, a]);
    },
  };

  const ariaValueText = `Hue ${Math.round(h)}°`;

  return (
    <Draggable
      ref={composeRefs(internalRef, ref)}
      onMove={onMove}
      keyMap={keyMap}
      disabled={disabled}
      aria-label="Hue"
      aria-valuetext={ariaValueText}
      aria-valuenow={Math.round(h)}
      aria-valuemin={0}
      aria-valuemax={360}
      className={cn("h-5 w-full", className)}
      style={{
        background:
          "linear-gradient(90deg, hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%), hsl(90, 100%, 50%), hsl(120, 100%, 50%), hsl(150, 100%, 50%), hsl(180, 100%, 50%), hsl(210, 100%, 50%), hsl(240, 100%, 50%), hsl(270, 100%, 50%),hsl(300, 100%, 50%), hsl(330, 100%, 50%), hsl(360, 100%, 50%))",
      }}
      {...props}
    >
      <ColorPickerHandle color={[h, 1, 1, 1]} left={h / 360} />
    </Draggable>
  );
};

const ColorPickerSaturation = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const {
    color: [h, s, v, a],
    onChange,
    disabled,
  } = useColorPickerContext();

  const internalRef = useRef<HTMLDivElement>(null);

  const onMove = ([x]: [number, number]) => {
    const rect = internalRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = x / rect.width;
    onChange?.([h, normalizedX, v, a]);
  };

  const keyMap = {
    left: (modifierKey: boolean) => {
      const newS = Math.max(0, s - (modifierKey ? 0.1 : 0.02));
      onChange?.([h, newS, v, a]);
    },
    right: (modifierKey: boolean) => {
      const newS = Math.min(1, s + (modifierKey ? 0.1 : 0.02));
      onChange?.([h, newS, v, a]);
    },
  };

  const ariaValueText = `Saturation ${Math.round(s * 100)}%`;

  return (
    <Draggable
      ref={composeRefs(internalRef, ref)}
      onMove={onMove}
      keyMap={keyMap}
      disabled={disabled}
      aria-label="Saturation"
      aria-valuetext={ariaValueText}
      aria-valuenow={Math.round(s * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-5 w-full", className)}
      style={{
        background: `linear-gradient(90deg, ${chroma.hsv(h, 0, v).css()}, ${chroma.hsv(h, 1, v).css()})`,
      }}
      {...props}
    >
      <ColorPickerHandle color={[h, s, v, a]} left={s} />
    </Draggable>
  );
};

const ColorPickerLightness = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const {
    color: [h, s, v, a],
    onChange,
    disabled,
  } = useColorPickerContext();

  const internalRef = useRef<HTMLDivElement>(null);

  const onMove = ([x]: [number, number]) => {
    const rect = internalRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = x / rect.width;
    onChange?.([h, s, normalizedX, a]);
  };

  const keyMap = {
    left: (modifierKey: boolean) => {
      const newV = Math.max(0, v - (modifierKey ? 0.1 : 0.02));
      onChange?.([h, s, newV, a]);
    },
    right: (modifierKey: boolean) => {
      const newV = Math.min(1, v + (modifierKey ? 0.1 : 0.02));
      onChange?.([h, s, newV, a]);
    },
  };

  const ariaValueText = `Lightness ${Math.round(v * 100)}%`;

  return (
    <Draggable
      ref={composeRefs(internalRef, ref)}
      onMove={onMove}
      keyMap={keyMap}
      disabled={disabled}
      aria-label="Lightness"
      aria-valuetext={ariaValueText}
      aria-valuenow={Math.round(v * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-5 w-full", className)}
      style={{
        background: `linear-gradient(90deg, ${chroma.hsv(h, s, 0).css()}, ${chroma.hsv(h, s, 1).css()})`,
      }}
      {...props}
    >
      <ColorPickerHandle color={[h, s, v, a]} left={v} />
    </Draggable>
  );
};

const ColorPickerAlpha = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const {
    color: [h, s, v, a],
    onChange,
    disabled,
  } = useColorPickerContext();

  const internalRef = useRef<HTMLDivElement>(null);

  const onMove = ([x]: [number, number]) => {
    const rect = internalRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = x / rect.width;
    onChange?.([h, s, v, normalizedX]);
  };

  const keyMap = {
    left: (modifierKey: boolean) => {
      const newAlpha = Math.max(0, a - (modifierKey ? 0.1 : 0.02));
      onChange?.([h, s, v, newAlpha]);
    },
    right: (modifierKey: boolean) => {
      const newAlpha = Math.min(1, a + (modifierKey ? 0.1 : 0.02));
      onChange?.([h, s, v, newAlpha]);
    },
  };

  const ariaValueText = `Alpha ${Math.round(a * 100)}%`;
  const baseColor = chroma.hsv(h, s, v).css();

  return (
    <Draggable
      ref={composeRefs(internalRef, ref)}
      onMove={onMove}
      keyMap={keyMap}
      disabled={disabled}
      aria-label="Alpha"
      aria-valuetext={ariaValueText}
      aria-valuenow={Math.round(a * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative h-5 w-full", className)}
      style={{
        backgroundImage: `
          linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%), 
          linear-gradient(-45deg, rgba(0,0,0,0.05) 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.05) 75%), 
          linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.05) 75%),
          linear-gradient(90deg, transparent, ${baseColor})
        `,
        backgroundSize: "8px 8px, 8px 8px, 8px 8px, 8px 8px, 100% 100%",
        backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px, 0 0",
      }}
      {...props}
    >
      <ColorPickerHandle color={[h, s, v, a]} left={a} />
    </Draggable>
  );
};

export {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerLightness,
  ColorPickerSaturation,
  type HSVA,
};
