import { LOG_IN } from "../constants/action-types";
import { LOG_OUT } from "../constants/action-types";

const initialState = {
    loggedIn: false,
    userId: null,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN:
            return { ...state, 
                id: action.payload.id,
                username: action.payload.username,
                profilePicture: action.payload.profilePicture,
                fullName: action.payload.fullName,
                totalPoints: action.payload.totalPoints,
                createdAt: action.payload.createdAt,
                tokenLogin: action.payload.tokenLogin
            };
        case LOG_OUT: 
            return {
                ...state, 
                id: null,
                username: null,
                profilePicture: null,
                fullName: null,
                totalPoints: null,
                createdAt: null
            };
        default:
            return state;
    }
};

export default rootReducer;