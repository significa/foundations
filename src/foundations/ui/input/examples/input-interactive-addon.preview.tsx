"use client";

import { useRef } from "react";
import { InfoIcon } from "@phosphor-icons/react";

import {
  Input,
  InputGroup,
  InputPrefix,
  InputSuffix,
} from "@/foundations/ui/input/input";
import { Tooltip } from "@/foundations/ui/tooltip/tooltip";

export default function InputInteractiveAddon() {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="w-90">
      <InputGroup>
        <InputPrefix className="pointer-events-auto" asChild>
          <button onClick={() => alert("interactive")}>+351</button>
        </InputPrefix>
        <Input ref={input} placeholder="000 000 000" />
        <InputSuffix className="pointer-events-auto">
          <Tooltip content="Your phone number will be visible">
            <InfoIcon />
          </Tooltip>
        </InputSuffix>
      </InputGroup>
    </div>
  );
}
