import { cva } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)) || undefined;
}

export function cnva<T>(...props: Parameters<typeof cva<T>>) {
  const styles = cva<T>(...props);

  return (...variants: Parameters<typeof styles>) => {
    return cn(styles(...variants));
  };
}
