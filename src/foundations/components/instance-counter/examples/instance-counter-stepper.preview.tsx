'use client';

import { createContext, type ReactNode, use, useState } from 'react';

import {
  InstanceCounterProvider,
  useInstanceCounter,
} from '@/foundations/components/instance-counter/instance-counter';
import { Button } from '@/foundations/ui/button/button';

const ITEMS = ['🥚', '🐣', '🐥', '🐓'];

const StepperContext = createContext(0);

const Stepper = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(0);

  return (
    <InstanceCounterProvider onChange={setLength}>
      <StepperContext value={currentIndex}>
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
          <div className="flex gap-2">
            <Button
              className="grow"
              size="sm"
              onClick={() => setCurrentIndex((c) => (c - 1 + length) % length)}
            >
              ←
            </Button>
            <Button
              className="grow"
              size="sm"
              onClick={() => setCurrentIndex((c) => (c + 1) % length)}
            >
              →
            </Button>
          </div>
          <div className="min-w-48 rounded-lg border border-border bg-background-secondary p-8 text-center">
            {children}
          </div>
        </div>
      </StepperContext>
    </InstanceCounterProvider>
  );
};

const StepperItem = ({ children }: { children: ReactNode }) => {
  const currentIndex = use(StepperContext);
  const index = useInstanceCounter();
  const isActive = index === currentIndex;

  return <>{isActive && children}</>;
};

const InstanceCounterStepper = () => {
  return (
    <Stepper>
      {ITEMS.map((item, index) => (
        <StepperItem key={index}>
          <div className="text-[32px]">{item}</div>
        </StepperItem>
      ))}
    </Stepper>
  );
};

export default InstanceCounterStepper;
