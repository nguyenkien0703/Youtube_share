import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
