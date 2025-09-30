import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
	atTop: boolean;
	isHeaderTransparent: boolean;
}

const initialState: UIState = {
	atTop: true,
	isHeaderTransparent: false,
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		setAtTop: (state, action: PayloadAction<boolean>) => {
			state.atTop = action.payload;
		},
		setIsHeaderTransparent: (state, action: PayloadAction<boolean>) => {
			state.isHeaderTransparent = action.payload;
		},
	},
});

export const { setAtTop, setIsHeaderTransparent } = uiSlice.actions;
export default uiSlice.reducer;
