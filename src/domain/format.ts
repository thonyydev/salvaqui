import type { SavedItem } from "./models";

export function normalizeLink(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (
      !(
        ["http:", "https:"].includes(parsed.protocol) &&
        parsed.hostname.includes(".")
      )
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function linkDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function relativeDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function searchable(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function matchesSearch(item: SavedItem, query: string): boolean {
  const normalizedQuery = searchable(query.trim());
  if (!normalizedQuery) return true;
  return searchable(`${item.title} ${item.url} ${item.description}`).includes(
    normalizedQuery,
  );
}

export function recentFirst(items: SavedItem[]): SavedItem[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
