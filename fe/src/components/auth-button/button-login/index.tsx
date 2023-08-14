import { useNavigate } from "react-router-dom";
import RButton from "../../elements/button";
export default function ButtonLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <RButton type="primary" onClick={handleLogin}>
        Login
      </RButton>
    </>
  );
}
