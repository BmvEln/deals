import type { DealPT } from "./types.ts";

export function generateNewId(items: DealPT[]) {
  const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
}
