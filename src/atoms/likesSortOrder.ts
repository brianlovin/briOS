import { atomWithStorage } from "jotai/utils";

export type SortDirection = "none" | "desc" | "asc";

interface TableSortState<TColumn extends string> {
  column: TColumn | null;
  direction: SortDirection;
}

export type SitesTableSortColumn = "name" | "site" | "likes";
export type StackTableSortColumn = "name" | "description" | "platforms" | "likes";

export type SitesTableSortState = TableSortState<SitesTableSortColumn>;
export type StackTableSortState = TableSortState<StackTableSortColumn>;

const defaultSitesTableSort: SitesTableSortState = { column: null, direction: "none" };
const defaultStackTableSort: StackTableSortState = { column: null, direction: "none" };

export const sitesTableSortAtom = atomWithStorage<SitesTableSortState>(
  "sites-table-sort",
  defaultSitesTableSort,
);

export const stackTableSortAtom = atomWithStorage<StackTableSortState>(
  "stack-table-sort",
  defaultStackTableSort,
);

export function getNextTableSort<TColumn extends string>(
  currentSort: TableSortState<TColumn>,
  column: TColumn,
  defaultDirection: Exclude<SortDirection, "none">,
): TableSortState<TColumn> {
  if (currentSort.column !== column || currentSort.direction === "none") {
    return { column, direction: defaultDirection };
  }

  if (currentSort.direction === defaultDirection) {
    return {
      column,
      direction: defaultDirection === "asc" ? "desc" : "asc",
    };
  }

  return { column: null, direction: "none" };
}

export function getTableSortDirection<TColumn extends string>(
  currentSort: TableSortState<TColumn>,
  column: TColumn,
): SortDirection {
  return currentSort.column === column ? currentSort.direction : "none";
}
