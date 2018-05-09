import { LOG_IN } from "../constants/action-types";
import { LOG_OUT } from "../constants/action-types";

export const logIn = user => ({ type: LOG_IN, payload: user });

export const logOut = () => ({type: LOG_OUT});