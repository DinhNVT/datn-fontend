export const truncateTitle = (text, maxLength, minLength = 0) => {
  if (text.length > maxLength) {
    return text.slice(minLength, maxLength) + "...";
  } else {
    return text;
  }
};

export const createSummary = (html, maxLength) => {
  const div = document.createElement("div");
  div.innerHTML = html;

  const paragraphs = div.getElementsByTagName("p");

  let summary = "";
  let length = 0;
  let i = 0;

  while (i < paragraphs.length && length < maxLength) {
    const paragraphText = paragraphs[i].textContent.trim();

    length += paragraphText.length;

    if (length > maxLength) {
      const remainingLength = maxLength - (length - paragraphText.length);
      summary += paragraphText.substring(0, remainingLength) + "...";
    } else {
      summary += paragraphText;
    }

    i++;
  }

  return summary;
};
