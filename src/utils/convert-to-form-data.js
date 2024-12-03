function buildFormData(formData, data, parentKey) {
  if (data && typeof data === "object" && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? "" : data;

    formData.append(parentKey, value);
  }
}

export function jsonToFormData(data) {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
}

export const insertInArray = (arr, index, newItem) => {
  if (arr.length === 0) {
    if (index === 0) {
      return [newItem]; // Insert at index 0
    } else {
      // Fill the array with undefined up to the specified index, then add the new item
      const newArr = new Array(index).fill(undefined);
      return [...newArr, newItem];
    }
  } else if (index >= 0 && index < arr.length) {
    // Replace the item at the specified index
    return [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
  } else {
    // Append the new item if index is out of bounds
    return [...arr, newItem];
  }
};
