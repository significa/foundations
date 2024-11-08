export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  intervalMs = 64
): (...args: Parameters<T>) => void {
  let id: ReturnType<typeof setTimeout> | null;
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    clearTimeout(id);

    const now = Date.now();
    const timeSinceLast = now - lastCallTime;
    const timeUntilNext = intervalMs - timeSinceLast;

    if (timeUntilNext <= 0) {
      lastCallTime = now;
      func(...args);
    } else {
      id = setTimeout(() => {
        lastCallTime = Date.now();
        func(...args);
      }, timeUntilNext);
    }
  };
}
