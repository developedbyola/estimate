type Options = {
  showDots?: boolean;
};

export const excerpt = (text: string, length = 12, opts?: Options) => {
  const { showDots = true } = opts || {};
  if (text.length > length) {
    const slicedText = text.slice(0, length);
    const newText = `${slicedText}${showDots ? '...' : ''}`;
    return newText;
  }
  return text;
};
