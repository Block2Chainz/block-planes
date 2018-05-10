import { LOG_IN } from "../constants/action-types";
import { LOG_OUT } from "../constants/action-types";

export const logIn = user => ({ type: LOG_IN, payload: user });

export const logOut = () => ({ type: LOG_OUT });

export const storeContract = (contract) => ({ type: STORE_CONTRACT, payload: contract });

export const storeUserAddress = (address) => ({ type: STORE_USER_ADDRESS, payload: address });

export const storeUserPlanes = (planes) => ({ type: STORE_USER_PLANES, payload: planes });


