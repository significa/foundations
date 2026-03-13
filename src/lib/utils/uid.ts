function* createUidGenerator(): Generator<number, never, unknown> {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const generator = createUidGenerator();

const uid = (prefix = "uid-"): string => {
  const id = generator.next().value;
  return prefix ? `${prefix}${id}` : `${id}`;
};

export { uid };
