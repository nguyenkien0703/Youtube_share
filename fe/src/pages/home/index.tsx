import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ListVideo from "../../components/home/list-video";
import MainLayout from "../../layout/main-layout";
import { RootState } from "../../stores";

export default function HomePage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <MainLayout>
      <>
        <h1>Home</h1>
        {isAuthenticated && (
          <div style={{ marginBottom: "20px" }}>
            <Link to={"/shared-video"}>Go to shared video page</Link>
          </div>
        )}
        <ListVideo />
      </>
    </MainLayout>
  );
}
