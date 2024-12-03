export function capitalizeWords(string) {
  const arr = string?.split(" ");
  const array = [];
  arr?.map((i) => {
    array.push(i?.charAt(0)?.toUpperCase() + i?.slice(1));
  });
  return array?.join(" ");
}

export function camelCaseToTitleCase(inputStr) {
  if (typeof inputStr == "number" || /\d+/.test(inputStr)) {
    return inputStr;
  }
  if (!inputStr) {
    return "";
  }
  let words = [];
  let word = "";
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr[i];
    if (char === char.toUpperCase()) {
      if (word) {
        words.push(word);
      }
      word = char.toLowerCase();
    } else {
      word += char;
    }
  }
  if (word) {
    words.push(word);
  }
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
