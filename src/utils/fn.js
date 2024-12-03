export const removeEmptyValue = (obj) => {
    let newObj = {};

    for (let key in obj) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        newObj[key] = obj[key];
      }
    }
  
    return newObj;
}