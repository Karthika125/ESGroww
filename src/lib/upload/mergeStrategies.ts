/**
 * Resolution strategies for overlapping calendar months or duplicate datasets.
 */
export const MERGE_STRATEGIES = [
  "REPLACE_OVERLAPS",
  "KEEP_EXISTING_ADD_MISSING",
  "MERGE_COMPARE_APPLY_INCOMING",
  "MERGE_COMPARE_APPLY_EXISTING",
  "SKIP_DUPLICATE_DATASET",
  "FORCE_DUPLICATE_REAUDIT",
] as const;

export type MergeStrategy = (typeof MERGE_STRATEGIES)[number];

export function parseMergeStrategy(raw: FormDataEntryValue | null): MergeStrategy | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  if (!s) return null;
  return (MERGE_STRATEGIES as readonly string[]).includes(s) ? (s as MergeStrategy) : null;
}

export function mergeStrategyRequiresIncomingFile(strategy: MergeStrategy): boolean {
  return (
    strategy === "REPLACE_OVERLAPS" ||
    strategy === "KEEP_EXISTING_ADD_MISSING" ||
    strategy === "MERGE_COMPARE_APPLY_INCOMING" ||
    strategy === "MERGE_COMPARE_APPLY_EXISTING"
  );
}
