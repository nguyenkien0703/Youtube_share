import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RButton from "../../elements/button";
import { signOut } from "../../../stores/auth/slice";

export interface IButtonLoginProps {}

export default function ButtonLogout(props: IButtonLoginProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(signOut());
    navigate("/");
  };
  return (
    <>
      <RButton type="primary" onClick={handleLogout}>
        Logout
      </RButton>
    </>
  );
}
