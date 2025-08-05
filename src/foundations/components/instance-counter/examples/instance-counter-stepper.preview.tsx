"use client";

import { createContext, ReactNode, use, useState } from "react";
import { Button } from "@/foundations/ui/button/button";
import {
  InstanceCounterProvider,
  useInstanceCounter,
} from "@/foundations/components/instance-counter/instance-counter";

const ITEMS = ["🥚", "🐣", "🐥", "🐓"];

const StepperContext = createContext(0);

const Stepper = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(0);

  return (
    <InstanceCounterProvider onChange={setLength}>
      <StepperContext value={currentIndex}>
        <div className="border-border flex flex-col gap-4 rounded-lg border p-4">
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
          <div className="bg-background-secondary border-border min-w-48 rounded-lg border p-8 text-center">
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
