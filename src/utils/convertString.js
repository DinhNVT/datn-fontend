export const capitalizeFirstLetter = (sentence) => {
  if (!sentence) {
    return sentence;
  }

  const firstLetter = sentence.charAt(0).toUpperCase();
  const restOfSentence = sentence.slice(1).toLowerCase();

  return firstLetter + restOfSentence;
};
