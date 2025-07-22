// features/filtration/model/slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PriceRange = [number, number];

export interface FiltersState {
	priceRange: PriceRange;
}

const initialState: FiltersState = {
	priceRange: [0, 1000],
};

export const filtersSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		setPriceRange(
			state,
			action: PayloadAction<FiltersState["priceRange"]>
		) {
			state.priceRange = action.payload;
		},
	},
});

export const { setPriceRange } = filtersSlice.actions;
export default filtersSlice.reducer;
