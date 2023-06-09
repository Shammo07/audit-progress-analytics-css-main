import { AUTHENTICATE, DEAUTHENTICATE } from '../types';

const initialState = {
    token: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "save_logo":
            return { logo: action.payload };
        case "remove_logo":
            return { logo: null };
        default:
            return state;
    }
};
