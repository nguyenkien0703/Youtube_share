import authWatcher from "./auth/saga";
import { all } from "redux-saga/effects";
import videosWacher from "./videos/saga";
import videoSharedWacher from "./videos-shared/saga";

export default function* rootSaga() {
  yield all([authWatcher(), videosWacher(), videoSharedWacher()]);
}
