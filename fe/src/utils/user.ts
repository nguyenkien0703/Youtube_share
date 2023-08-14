import { Cookies } from "react-cookie";

const cookies = new Cookies();

const serviceUser = {
  getAccessToken: () => {
    const token = cookies.get("JWT_TOKEN");
    return token ? token : null;
  },

  storeAccessToken: (token: string | null, expiredAt?: number) => {
    if (token && expiredAt) {
      cookies.set("JWT_TOKEN", token, { expires: new Date(expiredAt) });
      return;
    }
    cookies.remove("JWT_TOKEN");
  },
};

export default serviceUser;
