/**
 * Flattens a nested array one level and returns the result.
 *
 * @export
 * @param { T[][] } array
 * @param { T[] } additional Additional array of items to combine, items will be added to the start.
 * @return { T[] }
 */
export function flatten<T>(array: T[][], additional: T[]): T[] {
  const arrayLen = array.length;
  const reducedArray: T[] = additional ? additional : [];

  for (let index = 0; index < arrayLen; index++) {
    for (let i = 0; i < array[index].length; i++) {
      reducedArray.push(array[index][i]);
    }
  }

  return reducedArray;
}
