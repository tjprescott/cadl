import { ComponentChild, ComponentChildren } from "#jsx/jsx-runtime";

/**
 * Generates pairs of values from an iterable, along with an optional separator.
 *
 * @template T - The type of values in the iterable.
 * @param {Iterable<T>} iterator - The iterable to generate pairs from.
 * @param {string} [joiner=', '] - The optional separator to include between pairs.
 * @returns {Generator<[T, string | undefined]>} - A generator that yields pairs of values along with the separator.
 */
export function* withSep<T>(
  iterator: Iterable<T>,
  joiner = ", "
): Generator<[T, string | undefined]> {
  const iter = iterator[Symbol.iterator]();
  let current = iter.next();
  let next = iter.next();

  while (!current.done) {
    yield [current.value, next.done ? undefined : joiner];
    current = next;
    next = iter.next();
  }
}

/**
 * Maps an iterable with a separator and returns an array of mapped values.
 *
 * @template T - The type of the values in the iterable.
 * @param {Iterable<T>} iterator - The iterable to map.
 * @param {(value: T) => ComponentChild} mapFn - The mapping function to apply to each value.
 * @param {string} [joiner=', '] - The separator to use between mapped values.
 * @returns {ComponentChildren} - An array of mapped values.
 */
export function mapWithSep<T>(
  iterator: Iterable<T>,
  mapFn: (value: T) => ComponentChild,
  joiner = ", "
): ComponentChildren {
  const children: ComponentChildren = [];

  const separated = withSep(iterator, joiner);
  for (const [value, separator] of separated) {
    children.push(mapFn(value));
    if (separator) {
      children.push(separator);
    }
  }

  return children;
}
