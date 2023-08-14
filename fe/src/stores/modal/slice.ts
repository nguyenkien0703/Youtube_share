import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IModalState } from "./type";

const initialState: IModalState = {
  isOpenModalShareVideo: false,
  videoIdShare: 0,
};

const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    openModalShareVideo: (
      state: IModalState,
      action: PayloadAction<{ videoId: number }>
    ) => {
      state.isOpenModalShareVideo = true;
      state.videoIdShare = action.payload.videoId;
    },
    closeModalShareVideo: (state: IModalState) => {
      state.isOpenModalShareVideo = false;
    },
  },
});

export const { openModalShareVideo, closeModalShareVideo } = modalSlice.actions;

export default modalSlice.reducer;
