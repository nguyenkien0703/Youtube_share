import { ListParams, ListResponse } from "../stores/common";
import { IVideo } from "../stores/videos/type";
import axiosClient from "./axiosClient";

const videoApi = {
  getAll(params: ListParams): Promise<ListResponse<IVideo>> {
    const url = "/videos";
    return axiosClient.get(url, { params });
  },
  getVideoSharedAll(params: ListParams): Promise<ListResponse<IVideo>> {
    const url = "/videos/shared";
    return axiosClient.get(url, { params });
  },
  updateInteractVideo(videoId: number): Promise<any> {
    const url = `/videos/like/${videoId}`;
    return axiosClient.post(url);
  },
  shareVideoId(videoId: number): Promise<any> {
    const url = `/videos/share/${videoId}`;
    return axiosClient.post(url);
  }
};

export default videoApi;
