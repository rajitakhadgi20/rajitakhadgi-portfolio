export function isFigmaUrl(url) {
  return typeof url === "string" && /^https?:\/\/([\w-]+\.)?figma\.com\//i.test(url.trim());
}

export function figmaEmbedUrl(url) {
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url.trim())}`;
}