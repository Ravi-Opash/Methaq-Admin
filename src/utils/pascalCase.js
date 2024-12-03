export const pascalCase = (inputString) => {
  let words = [];
  let currentWord = "";

  for (let i = 0; i < inputString?.length; i++) {
    const char = inputString[i];

    if (char === char.toUpperCase()) {
      if (currentWord) {
        words.push(currentWord);
      }
      currentWord = char;
    } else {
      currentWord += char;
    }
  }

  if (currentWord) {
    words.push(currentWord);
  }

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
