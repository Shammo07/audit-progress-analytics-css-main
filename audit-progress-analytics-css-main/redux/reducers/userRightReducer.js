import { AUTHENTICATE, DEAUTHENTICATE } from '../types';

const initialState = {
    token: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "save_user_right":
            return { right: action.payload };
        case "remove_user_right":
            return { right: null };
        default:
            return state;
    }
};
