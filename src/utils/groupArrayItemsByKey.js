/**
 * 
 * @param { array } stops 
 * @returns object with arrays
 * 
 * returns an object with arrays of trainstops keyed by trainline
 */
export const groupArrayItemsByKey = arr => {
    const groups = {};
  
    // Group array items by `trainline_id`
    arr.forEach(obj => {
      const key = obj.trainline_id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(obj);
    });
    return groups;
  }
  
  
  
  
  