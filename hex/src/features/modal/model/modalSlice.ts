import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalType = "login" | "register" | "search" | null;

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.isOpen = true;
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
    },
    toggleModalType: (state) => {
      if (state.modalType === "login") state.modalType = "register";
      else if (state.modalType === "register") state.modalType = "login";
    },
  },
});

export const { openModal, closeModal, toggleModalType } = modalSlice.actions;
export default modalSlice.reducer;
