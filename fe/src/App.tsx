import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import { useNotification } from "./hooks/use-notification";
import { PrivateRoute } from "./layout/private-route";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/not-found";
import RegisterPage from "./pages/register";
import SharedVideoPage from "./pages/shared-video";
import { useSelector } from "react-redux";
import { RootState } from "./stores";

function App() {
  const { openNotification, contextHolder } = useNotification();
  const { currentUserId } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL ?? ""); // Replace with your server URL
    socket.on("connect", () => {
      console.log("socket connected");
    });
    socket.on("videoShared", (notification: any) => {
      if (notification.userId === currentUserId) {
        openNotification({
          message: "Shared video success fully!",
          placement: "bottomRight",
          type: "success",
        });
      } else {
        openNotification({
          message: notification.message.text,
          placement: "bottomRight",
          type: "success",
        });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);
  return (
    <div className="App">
      {contextHolder}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route
          path="/shared-video"
          element={
            <PrivateRoute>
              <SharedVideoPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
