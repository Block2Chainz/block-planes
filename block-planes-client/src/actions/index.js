import {
    LOG_IN,
    LOG_OUT,
    STORE_CONTRACT,
    STORE_USER_ADDRESS,
    STORE_USER_PLANES,
    TOGGLE_CHAT_VISIBILITY,
    STORE_PLANES,
    SELECT_PLANE,
    DESELECT_PLANE,
    SAVE_SOCKET,
} from "../constants/action-types";

export const logIn = user => ({
    type: LOG_IN,
    payload: user
});

export const logOut = () => ({
    type: LOG_OUT
});

export const storeContract = (contract) => ({
    type: STORE_CONTRACT,
    payload: contract
});

export const storePlanes = (planes) => ({
    type: STORE_PLANES,
    payload: planes
});

export const toggleChatVisibility = (flag) => ({
    type: TOGGLE_CHAT_VISIBILITY,
    payload: flag
});

export const selectPlane = (plane) => ({
    type: SELECT_PLANE,
    payload: plane
});

export const deselectPlane = () => ({
    type: DESELECT_PLANE,
});

export const saveSocket = (socket) => ({
    type: SAVE_SOCKET, 
    payload: socket,
})