export const getExcerpt = (html: string, length = 150) => {
  const text = html.replace(/<[^>]+>/g, "");
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export const getReadTime = (html: string) => {
  const text = html.replace(/<[^>]+>/g, "");
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  if (words === 0 || text.trim() === "") return "0 min read";
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
};
