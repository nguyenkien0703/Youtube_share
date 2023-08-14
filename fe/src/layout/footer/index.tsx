import style from "./style.module.scss";
import { Layout } from "antd";
const { Footer } = Layout;

const FooterDesign = () => {
  return (
    <Footer className={style.footer}>
      Ant Design ©2023 Created by Ant UED
    </Footer>
  );
};

export default FooterDesign;
