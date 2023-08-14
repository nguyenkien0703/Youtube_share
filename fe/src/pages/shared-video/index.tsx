import ListVideoShared from "../../components/shared-video/list-video-shared";
import MainLayout from "../../layout/main-layout";

export default function SharedVideoPage() {
  return (
    <MainLayout>
      <>
        <h1>Shared Video</h1>
        <ListVideoShared />
      </>
    </MainLayout>
  );
}
