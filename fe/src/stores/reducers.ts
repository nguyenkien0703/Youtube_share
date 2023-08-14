import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";
import videoReducer from "./videos/slice";
import videoSharedReducer from "./videos-shared/slice";
import modalReducer from "./modal/slice";

const rootReduder = combineReducers({
  auth: authReducer,
  video: videoReducer,
  videoShared: videoSharedReducer,
  modal: modalReducer,
});

export default rootReduder;
