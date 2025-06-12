"use client";

import { Eye, EyeClosed, Lock } from "@phosphor-icons/react";
import { useState } from "react";

import { Input, InputGroup, InputPrefix, InputSuffix } from "../input";

export default function InputIconAction() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-90">
      <InputGroup>
        <InputPrefix>
          <Lock />
        </InputPrefix>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Your password here"
        />
        <InputSuffix interactive>
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </InputSuffix>
      </InputGroup>
    </div>
  );
}
