import { RootState } from "@/store/index";

export const selectPriceRange = (state: RootState) => state.filters.priceRange;
