/* Helpers for showing a live Figma file inside the site. */

export function isFigmaUrl(url) {
  return typeof url === "string" && /^https?:\/\/([\w-]+\.)?figma\.com\//i.test(url.trim());
}

/* Turns any normal Figma link (design / file / proto / board) into an embed link.
   The file must be shared as "Anyone with the link can view" in Figma. */
export function figmaEmbedUrl(url) {
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url.trim())}`;
}