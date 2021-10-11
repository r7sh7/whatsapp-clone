import { auth } from "../../config/fbconfig";
import { LOGIN, LOGOUT } from "../constants";

export const login = (user) => {
  return (dispatch) => {
    const profile = {
      name: user.displayName,
      pno: user.phoneNumber,
      photoURL: user.photoURL,
    };

    sessionStorage.setItem("whatsapp-user", JSON.stringify(profile));
    dispatch({ type: LOGIN, payload: { profile } });
  };
};

export const logout = () => {
  return (dispatch) => {
    auth.signOut().then(() => {
      dispatch({ type: LOGOUT });
      sessionStorage.removeItem("whatsapp-uid");
      sessionStorage.removeItem("whatsapp-user");
    });
  };
};
