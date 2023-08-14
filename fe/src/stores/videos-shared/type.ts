import { ListParams, PaginationParams } from "../common";
import { EActionStatus } from "../type";
import { IVideo } from "../videos/type";

export interface IVideosSharedState{
  status: EActionStatus;
  videoSharedList: IVideo[];
  filter: ListParams;
  pagination: PaginationParams;
}
