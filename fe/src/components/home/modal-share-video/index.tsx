import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { closeModalShareVideo } from "../../../stores/modal/slice";
import { shareVideo } from "../../../stores/videos/slice";

export default function ModalShareVideo() {
  const dispatch = useDispatch();
  const { isOpenModalShareVideo, videoIdShare } = useSelector(
    (state: RootState) => state.modal
  );

  const handleCloseModal = () => {
    dispatch(closeModalShareVideo());
  };

  const handleShareVideo = () => {
    dispatch(shareVideo({ videoId: videoIdShare }));
    handleCloseModal();
  };

  return (
    <>
      <Modal
        title="Share video"
        centered
        open={isOpenModalShareVideo}
        onOk={() => handleShareVideo()}
        onCancel={() => handleCloseModal()}
        width={500}
      >
        <p>Want to share this video with everyone?</p>
      </Modal>
    </>
  );
}
