export { default as filtersReducer, toggleOption } from "./model/slice";
export type { SortOption } from "./model/types";
export { getFiltersFromUrl } from "./model/utils/queryString";
export { getFilteredProducts } from "./model/api/getFilteredProducts";

