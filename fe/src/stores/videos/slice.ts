import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EActionStatus } from "../type";
import { IVideo, IVideosState } from "./type";
import { ListParams, ListResponse } from "../common";

const initialState: IVideosState = {
  status: EActionStatus.Idle,
  statusInteracVideo: EActionStatus.Idle,
  statusShareVideo: EActionStatus.Idle,
  videosList: [],
  keywordSearch: "",
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

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    getAllVideosRequest: (
      state: IVideosState,
      _: PayloadAction<ListParams>
    ) => {
      state.status = EActionStatus.Pending;
    },
    getAllVideosSuccess: (
      state: IVideosState,
      action: PayloadAction<ListResponse<IVideo>>
    ) => {
      state.status = EActionStatus.Succeeded;
      state.videosList = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getAllVideosFailed: (state: IVideosState) => {
      state.status = EActionStatus.Failed;
    },
    interactVideo: (
      state: IVideosState,
      _: PayloadAction<{ videoId: number }>
    ) => {
      state.statusInteracVideo = EActionStatus.Pending;
      state.statusShareVideo = EActionStatus.Idle;
    },

    interactVideoSuccess: (state: IVideosState) => {
      state.statusInteracVideo = EActionStatus.Succeeded;
    },

    interactVideoFailed: (state: IVideosState) => {
      state.statusInteracVideo = EActionStatus.Failed;
    },

    shareVideo: (
      state: IVideosState,
      _: PayloadAction<{ videoId: number }>
    ) => {
      state.statusShareVideo = EActionStatus.Pending;
      state.statusInteracVideo = EActionStatus.Idle;
    },
    shareVideoSuccess: (state: IVideosState) => {
      state.statusShareVideo = EActionStatus.Succeeded;
    },

    shareVideoFailed: (state: IVideosState) => {
      state.statusShareVideo = EActionStatus.Failed;
    },

    setKeywordSearch: (
      state: IVideosState,
      action: PayloadAction<{ newKeyword: string }>
    ) => {
      state.keywordSearch = action.payload.newKeyword;
    },

    setFilter(state, action: PayloadAction<ListParams>) {
      state.filter = action.payload;
      state.statusInteracVideo = EActionStatus.Idle;
      state.statusShareVideo = EActionStatus.Idle;
    },
  },
});

export const {
  getAllVideosRequest,
  getAllVideosSuccess,
  getAllVideosFailed,
  interactVideo,
  interactVideoSuccess,
  interactVideoFailed,
  shareVideo,
  shareVideoSuccess,
  shareVideoFailed,
  setKeywordSearch,
  setFilter,
} = videoSlice.actions;

export default videoSlice.reducer;
