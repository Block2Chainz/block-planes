import { LOG_IN } from "../constants/action-types";
import { LOG_OUT } from "../constants/action-types";

const initialState = {
    loggedIn: false
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN:
            return { ...state, 
                loggedIn: true, 
                profilePic: action.payload.profilePic,
                username: action.payload.username, 
                fullname: action.payload.username, 
                id: action.payload.id, 
                totalPoints: action.payload.totalPoints,
                hasSession: true,
            };
        case LOG_OUT: 
            return {
                ...state, 
                loggedIn: false,
                profilePic: null,
                username: null,
                fullname: null,
                id: null,
                totalPoints: null,
                hasSession: false,
            }
        default:
            return state;
    }
};

export default rootReducer;