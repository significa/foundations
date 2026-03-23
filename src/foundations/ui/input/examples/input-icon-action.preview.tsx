'use client';

import { EyeClosedIcon, EyeIcon, LockIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { Input } from '@/foundations/ui/input/input';

export default function InputIconAction() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-90">
      <Input.Group>
        <Input.Prefix>
          <LockIcon />
        </Input.Prefix>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Your password here"
        />
        <Input.Suffix className="pointer-events-auto">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
          </button>
        </Input.Suffix>
      </Input.Group>
    </div>
  );
}
