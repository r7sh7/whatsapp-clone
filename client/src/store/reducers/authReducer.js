import { LOGIN, LOGOUT } from "../constants";

const initState = {
  user: sessionStorage.getItem("whatsapp-user")
    ? JSON.parse(sessionStorage.getItem("whatsapp-user"))
    : null,
  loading: true,
};

export const authReducer = (state = initState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case LOGOUT:
      return {};
    default:
      return state;
  }
};
