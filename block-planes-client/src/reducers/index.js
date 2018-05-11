import {
    LOG_IN,
    LOG_OUT,
    STORE_CONTRACT,
    STORE_USER_ADDRESS,
    STORE_USER_PLANES
} from "../constants/action-types";

const initialState = {
    loggedIn: false,
    userId: null,
    userAddress: '0x0',
    userPlanes: [],
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
        case STORE_CONTRACT: 
            return {
                ...state, 
                contract: action.payload,
            };
        case STORE_USER_ADDRESS: 
            return {
                ...state, 
                userAddress: action.payload,
            };
        case STORE_USER_PLANES: 
            return {
                ...state,
                contract: action.payload.contract,
                userAddress: action.payload.userAddress,
                userPlanes: action.payload.userPlanes,
            };
        default:
            return state;
    }
};

export default rootReducer;