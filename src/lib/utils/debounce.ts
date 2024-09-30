export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay = 64
): (...args: Parameters<T>) => void {
  let id: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<T>) => {
    if (id) {
      clearTimeout(id);
    }

    id = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
