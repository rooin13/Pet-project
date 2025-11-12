import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PriceRange = [number, number];

export interface FiltersState {
	priceRange: PriceRange;
	selectedOptions: Record<string, string[]>;
	sortBy: "price-asc" | "price-desc" | null;
	initialized: boolean; // 🔹 новый флаг
}

const initialState: FiltersState = {
	priceRange: [1, 1000],
	selectedOptions: {},
	sortBy: null,
	initialized: false, // по умолчанию false
};

export const filtersSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		setPriceRange(state, action: PayloadAction<FiltersState["priceRange"]>) {
			state.priceRange = action.payload;
		},
		toggleOption: (
			state,
			action: PayloadAction<{ field: string; value: string }>
		) => {
			const { field, value } = action.payload;

			const prev = state.selectedOptions[field] || [];
			const exists = prev.includes(value);
			const next = exists
				? prev.filter((item) => item !== value)
				: [...prev, value];
			return {
				...state,
				selectedOptions: {
					...state.selectedOptions,
					[field]: next,
				},
			};
		},
		setFiltersFromUrl(state, action: PayloadAction<Record<string, string[]>>) {
			state.selectedOptions = action.payload;
			state.initialized = true;
		},
		resetFilters(state) {
			state.selectedOptions = {};
			state.priceRange = [0, 1000];
			state.sortBy = null;
			state.initialized = false; // сброс
		},
		clearFilters(state) {
			state.selectedOptions = {};
			state.initialized = false; // сброс
		},
		setSortBy(state, action: PayloadAction<FiltersState["sortBy"]>) {
			state.sortBy = action.payload;
		},
	},
});

export const { setPriceRange, setFiltersFromUrl, toggleOption, resetFilters, clearFilters, setSortBy } = filtersSlice.actions;
export default filtersSlice.reducer;
