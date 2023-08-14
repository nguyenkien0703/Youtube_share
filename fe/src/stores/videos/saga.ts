import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLeading } from "redux-saga/effects";
import videoApi from "../../api/videoApi";
import { ListParams, ListResponse } from "../common";
import { IAction } from "../type";
import {
  getAllVideosFailed,
  getAllVideosRequest,
  getAllVideosSuccess,
  interactVideo,
  interactVideoFailed,
  interactVideoSuccess,
  setKeywordSearch,
  shareVideo,
  shareVideoFailed,
  shareVideoSuccess,
} from "./slice";
import { IVideo, ShareVideoResponse } from "./type";

function* getAllVideosWorker(action: PayloadAction<ListParams>) {
  try {
    const response: ListResponse<IVideo> = yield call(
      videoApi.getAll,
      action.payload
    );
    if (response) {
      yield put({
        type: getAllVideosSuccess.toString(),
        payload: response,
      });
    }
  } catch (error: any) {
    yield put({ type: getAllVideosFailed.toString() });
  }
}

function* interactVideosWorker(
  action: IAction<{
    videoId: number;
  }>
) {
  try {
    const { videoId } = action.payload;
    //call api update interact video
    yield call(videoApi.updateInteractVideo, videoId);
    //end update
    yield put({
      type: interactVideoSuccess.toString(),
    });
  } catch (error: any) {
    yield put({ type: interactVideoFailed.toString() });
  }
}

function* watchKeywordSearchChange(
  action: IAction<{
    newKeyword: string;
  }>
) {
  const currentFilter: ListParams = yield select((state) => state.video.filter);
  yield put(
    getAllVideosRequest({
      ...currentFilter,
      search: action.payload.newKeyword,
    })
  );
}

function* shareVideoWorker(
  action: IAction<{
    videoId: number;
  }>
) {
  try {
    const { videoId } = action.payload;
    const response: ShareVideoResponse = yield call(
      videoApi.shareVideoId,
      videoId
    );
    if (response)
      yield put({
        type: shareVideoSuccess.toString(),
      });
  } catch (error) {
    yield put({ type: shareVideoFailed.toString() });
  }
}

function* videosWacher() {
  yield takeLeading(getAllVideosRequest.toString(), getAllVideosWorker);
  yield takeLeading(interactVideo.toString(), interactVideosWorker);
  yield takeLeading(shareVideo.toString(), shareVideoWorker);
  yield takeLeading(setKeywordSearch.toString(), watchKeywordSearchChange);
}

export default videosWacher;
