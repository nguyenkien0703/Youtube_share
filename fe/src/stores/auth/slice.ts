import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EActionStatus } from "../type";
import { IAuthState, LoginPayload, RegisterPayload } from "./type";
import serviceUser from "../../utils/user";

const initialState: IAuthState = {
  status: EActionStatus.Idle,
  statusSignUp: EActionStatus.Idle,
  jwtAuth: null,
  currentUserId: 0,
  isAuthenticated: !!serviceUser.getAccessToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state: IAuthState, _: PayloadAction<LoginPayload>) => {
      state.status = EActionStatus.Pending;
    },
    signInSuccess: (
      state: IAuthState,
      action: PayloadAction<{ jwtToken: string; currentUserId: number }>
    ) => {
      state.status = EActionStatus.Succeeded;
      state.isAuthenticated = true;
      state.jwtAuth = action.payload.jwtToken;
      state.currentUserId = action.payload.currentUserId;
    },
    signInFail: (state: IAuthState) => {
      state.status = EActionStatus.Failed;
    },
    signUp: (state: IAuthState, _: PayloadAction<RegisterPayload>) => {
      state.statusSignUp = EActionStatus.Pending;
    },
    signUpSuccess: (state: IAuthState) => {
      state.statusSignUp = EActionStatus.Succeeded;
    },
    signUpFail: (state: IAuthState) => {
      state.statusSignUp = EActionStatus.Failed;
    },
    signOut: (state: IAuthState) => {
      state.status = EActionStatus.Idle;
    },
    signOutSuccess: (state: IAuthState) => {
      state.isAuthenticated = false;
    },
    updateAuth: (
      state: IAuthState,
      action: PayloadAction<{ isAuthenticated: boolean }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
});

export const {
  signIn,
  signInSuccess,
  signInFail,
  signUp,
  signUpSuccess,
  signUpFail,
  signOut,
  signOutSuccess,
  updateAuth,
} = authSlice.actions;

export default authSlice.reducer;
