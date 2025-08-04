"use client";

import { EyeIcon, EyeClosedIcon, LockIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Input, InputGroup, InputPrefix, InputSuffix } from "../input";

export default function InputIconAction() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-90">
      <InputGroup>
        <InputPrefix>
          <LockIcon />
        </InputPrefix>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Your password here"
        />
        <InputSuffix className="pointer-events-auto">
          <button
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
          </button>
        </InputSuffix>
      </InputGroup>
    </div>
  );
}
