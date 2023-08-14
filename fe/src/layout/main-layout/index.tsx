import { ReactElement } from "react";
import ModalShareVideo from "../../components/home/modal-share-video";
import FooterDesign from "../footer";
import Header from "../header";
import style from "./style.module.scss";

interface IProps {
  children: ReactElement;
}

export default function MainLayout({ children }: IProps) {
  return (
    <main className={style.mainLayout}>
      <ModalShareVideo />
      <Header />
      <div className={style.content}> {children}</div>
      <FooterDesign />
    </main>
  );
}
