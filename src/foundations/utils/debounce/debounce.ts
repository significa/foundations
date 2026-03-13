export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  intervalMs = 64
): ((...args: Parameters<T>) => void) => {
  let id: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<T>) => {
    if (id) {
      clearTimeout(id);
    }

    id = setTimeout(() => {
      func(...args);
    }, intervalMs);
  };
};
