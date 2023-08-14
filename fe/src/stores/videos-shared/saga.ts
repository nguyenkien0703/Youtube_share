import { PayloadAction } from "@reduxjs/toolkit";
import { ListParams, ListResponse } from "../common";
import { IVideo } from "../videos/type";
import videoApi from "../../api/videoApi";
import { call, put, takeLeading } from "redux-saga/effects";
import {
  getAllVideoSharedFailed,
  getAllVideoSharedRequest,
  getAllVideoSharedSuccess,
} from "./slice";

function* getAllVideoSharedWorker(action: PayloadAction<ListParams>) {
  try {
    const response: ListResponse<IVideo> = yield call(
      videoApi.getVideoSharedAll,
      action.payload
    );
    if (response) {
      yield put({
        type: getAllVideoSharedSuccess.toString(),
        payload: response,
      });
    }
  } catch (error: any) {
    yield put({ type: getAllVideoSharedFailed.toString() });
  }
}

function* videoSharedWacher() {
  yield takeLeading(
    getAllVideoSharedRequest.toString(),
    getAllVideoSharedWorker
  );
}

export default videoSharedWacher;
