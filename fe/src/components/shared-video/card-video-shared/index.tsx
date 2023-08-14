import { FieldTimeOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { formatDate } from "../../../utils/date";

const { Meta } = Card;
export interface CardVideoProps {
  title: string;
  urlVideo: string;
  timeShared: string;
}

export default function CardVideoShared({
  title,
  urlVideo,
  timeShared,
}: CardVideoProps) {
  return (
    <Card
      cover={
        <iframe
          width="100%"
          height="315"
          src={urlVideo}
          allowFullScreen
        ></iframe>
      }
    >
      <Meta
        title={title}
        description={
          <div
            style={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              columnGap: "10px",
            }}
          >
            <FieldTimeOutlined style={{ fontSize: "20px" }} />
            {formatDate(timeShared)}
          </div>
        }
      />
    </Card>
  );
}
