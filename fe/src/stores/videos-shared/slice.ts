import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IVideosSharedState } from "./type";
import { EActionStatus } from "../type";
import { ListParams, ListResponse } from "../common";
import { IVideo } from "../videos/type";

const initialState: IVideosSharedState = {
  status: EActionStatus.Idle,
  videoSharedList: [],
  filter: {
    _page: 1,
    _limit: 10,
  },
  pagination: {
    _page: 1,
    _limit: 10,
    _totalRows: 10,
  },
};

const videoSharedSlice = createSlice({
  name: "videoShared",
  initialState,
  reducers: {
    getAllVideoSharedRequest: (
      state: IVideosSharedState,
      _: PayloadAction<ListParams>
    ) => {
      state.status = EActionStatus.Pending;
    },
    getAllVideoSharedSuccess: (
      state: IVideosSharedState,
      action: PayloadAction<ListResponse<IVideo>>
    ) => {
      state.status = EActionStatus.Succeeded;
      state.videoSharedList = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getAllVideoSharedFailed: (state: IVideosSharedState) => {
      state.status = EActionStatus.Pending;
    },
    setFilter(state, action: PayloadAction<ListParams>) {
      state.filter = action.payload;
    },
  },
});

export const {
  getAllVideoSharedRequest,
  getAllVideoSharedSuccess,
  getAllVideoSharedFailed,
  setFilter,
} = videoSharedSlice.actions;

export default videoSharedSlice.reducer;
