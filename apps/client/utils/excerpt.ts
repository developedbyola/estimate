export const excerpt = (text: string, length = 12) => {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  }
  return text;
};
