import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ButtonLogin from "../../components/auth-button/button-login";
import ButtonLogout from "../../components/auth-button/button-logout";
import InputSearch from "../../components/elements/input-search";
import useDebounce from "../../hooks/use-debounce";
import avatar from "../../images/logo.png";
import { RootState } from "../../stores";
import {
  setKeywordSearch
} from "../../stores/videos/slice";
import style from "./style.module.scss";

export interface HeaderProps {}
const Header = ({}: HeaderProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [keyword, setKeyword] = useState<string>("");
  const searchDebounceValue = useDebounce(keyword, 300);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setKeywordSearch({ newKeyword: searchDebounceValue?.trim() }));
  }, [dispatch, searchDebounceValue]);

  return (
    <div className={style.header}>
      <Row gutter={30} align="middle">
        <Col flex={2} className="gutter-row">
          <div>
            <Link to="/">
              <img src={avatar} alt="avatar" width={150} height={50} />
            </Link>
          </div>
        </Col>
        <Col flex={4} className="gutter-row">
          <div>
            <InputSearch
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </Col>
        <Col flex={2} className="gutter-row">
          {!isAuthenticated ? <ButtonLogin /> : <ButtonLogout />}
        </Col>
      </Row>
    </div>
  );
};

export default Header;
