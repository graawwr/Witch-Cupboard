/** Split free text into reference-list lines. */
export function textToLines(text) {
  if (!text?.trim()) return [];
  return text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
}
