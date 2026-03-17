'use client';

import chroma from 'chroma-js';
import { useState } from 'react';

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerSaturation,
  type HSVA,
} from '@/foundations/ui/color-picker/color-picker';

export default function ColorPickerMultipleFormatsExample() {
  const [color, setColor] = useState<HSVA>([0, 1, 1, 1]);

  return (
    <div className="flex justify-center">
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <ColorPicker className="w-36" color={color} onColorChange={setColor}>
            <ColorPickerArea />
            <ColorPickerHue className="mt-2" />
            <ColorPickerSaturation className="mt-2" />
            <ColorPickerAlpha className="mt-2" />
          </ColorPicker>
        </div>

        <div className="flex w-36 flex-col gap-3">
          <div
            className="h-8 w-full flex-1 rounded-xl border border-foreground/10 bg-[var(--bg-color,--alpha(var(--color-foreground)/10%))]"
            style={
              color
                ? {
                    '--bg-color': chroma
                      .hsv(color[0], color[1], color[2])
                      .css(),
                  }
                : {}
            }
          />

          <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 font-mono text-xs">
            <span className="font-medium text-foreground-secondary">HEX</span>
            <code className="rounded bg-background-secondary px-1.5 py-0.5">
              {chroma.hsv(color[0], color[1], color[2]).hex().toUpperCase()}
            </code>

            <span className="font-medium text-foreground-secondary">RGB</span>
            <code className="rounded bg-background-secondary px-1.5 py-0.5">
              {chroma.hsv(color[0], color[1], color[2]).css()}
            </code>

            <span className="font-medium text-foreground-secondary">HSV</span>
            <code className="rounded bg-background-secondary px-1.5 py-0.5">
              {Math.round(color[0])}, {Math.round(color[1] * 100)}%,{' '}
              {Math.round(color[2] * 100)}%
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
