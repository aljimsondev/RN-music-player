/**
 * Shuffle the content of the array
 * @param array - Array to be shuffled
 * @returns
 */

export const shuffle = (array: any[]) => {
  /**
   * shuffle the given array
   */
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
