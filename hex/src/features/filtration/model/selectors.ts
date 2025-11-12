import { RootState } from "@/store";

export const selectPriceRange = (state: RootState) => state.filters.priceRange;
