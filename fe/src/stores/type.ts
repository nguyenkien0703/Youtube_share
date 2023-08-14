import { Action } from "redux";

export interface IAction<Payload = any> extends Action {
  payload: Payload;
}

export enum EActionStatus {
  Idle = "idle",
  Pending = "pending",
  Succeeded = "succeeded",
  Failed = "failed",
}
