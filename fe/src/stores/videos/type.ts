import { ListParams, PaginationParams } from "../common";
import { EActionStatus } from "../type";

export interface IVideo {
  id: number;
  title: string;
  url: string;
  likeCount: number;
  reactVideo: boolean | null;
  createdAt: string;
}

export interface IVideosState {
  status: EActionStatus;
  statusInteracVideo: EActionStatus;
  statusShareVideo: EActionStatus;
  videosList: IVideo[];
  keywordSearch: string;
  filter: ListParams;
  pagination: PaginationParams;
}

export interface ShareVideoResponse {
  success: boolean;
}
