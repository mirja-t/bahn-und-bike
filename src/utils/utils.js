/** 
 * Groups an array of objects by a specified key using a Map.
 * @param {string} key - The key to group the objects by.
 * @param {Array} arr - The input array of objects to group.
 * @returns {Array} - An array of arrays.
 */

export function groupByKey(key, arr) {
    const groups = new Map();
    arr.forEach((item) => {
      const groupKey = item[key];
      const group = groups.get(groupKey);
      if (!group) {
        groups.set(groupKey, [item]);
      } else {
        group.push(item);
      }
    });
    return Array.from(groups.values());
  }


  /** 
 * Finds the shortest array in object of arrays.
 * @param {Object} groups - The input object with arrays.
 * @returns {Array} - The property value of the input array with the least items. 
 */

  export const getShortestArray = groups => {
    let shortestArray = null;
    for (const key in groups) {
      const currentArray = groups[key];
      if (!shortestArray || currentArray.length < shortestArray.length) {
        shortestArray = currentArray;
      }
    }
    
    return shortestArray;
}

/** 
 * Turns a string into an array of strings.
 * @param {string} str - The input string.
 * @returns {Array} - An array of strings separated by comma. 
 */

export const separateStr = str => {
    return str.split(',').map(item => item.trim());
}