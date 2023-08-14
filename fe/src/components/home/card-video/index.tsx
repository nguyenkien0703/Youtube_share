import {
  DislikeOutlined,
  EditOutlined,
  HeartOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import clsx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import style from "./style.module.scss";

const { Meta } = Card;
export interface CardVideoProps {
  id: number;
  title: string;
  likeCount: number;
  reactVideo: boolean | null;
  urlVideo: string;
  onChangeReact: (videoId: number) => void;
  onChangeModalShareVideo: (videoId: number) => void;
}

export default function CardVideo({
  id,
  title,
  likeCount,
  reactVideo,
  urlVideo,
  onChangeReact,
  onChangeModalShareVideo,
}: CardVideoProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isInteract, setIsInteract] = useState<boolean | null>(reactVideo);
  const [reactCount, setReactCount] = useState<number>(likeCount);

  const handleReactVideo = (reactVideo: boolean | null) => {
    if (reactVideo == null) {
      setIsInteract(true);
      setReactCount(reactCount + 1);
    } else {
      if (reactVideo) {
        setIsInteract(false);
        setReactCount(reactCount - 1);
      } else {
        setIsInteract(null);
      }
    }
    onChangeReact(id);
  };

  const hanldeModalShareVideo = () => {
    onChangeModalShareVideo(id);
  };

  return (
    <>
      <Card
        cover={
          <iframe
            width="100%"
            height="315"
            src={urlVideo}
            allowFullScreen
          ></iframe>
        }
        actions={
          isAuthenticated
            ? [
                isInteract || isInteract === null ? (
                  <LikeOutlined
                    className={clsx(
                      { [style.color_button_like]: isInteract },
                      { [style.hover_button_interact]: isInteract !== true }
                    )}
                    style={{ fontSize: "16px" }}
                    onClick={() => handleReactVideo(isInteract)}
                  />
                ) : (
                  <DislikeOutlined
                    className={clsx({
                      [style.hover_button_interact]: isInteract === false
                    })}
                    style={{ fontSize: "16px" }}
                    onClick={() => handleReactVideo(isInteract)}
                  />
                ),
                <EditOutlined
                  key="edit"
                  style={{ fontSize: "16px" }}
                  onClick={() => hanldeModalShareVideo()}
                />,
              ]
            : []
        }
      >
        <Meta
          title={title}
          description={
            <div style={{ fontWeight: "bold" }}>
              <HeartOutlined style={{ color: "red", fontSize: "16px" }} />{" "}
              {reactCount}
            </div>
          }
        />
      </Card>
    </>
  );
}
