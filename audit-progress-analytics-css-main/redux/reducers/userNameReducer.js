import { AUTHENTICATE, DEAUTHENTICATE } from '../types';

const initialState = {
    token: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "save_user_name":
            return { username: action.payload };
        case "remove_user_name":
            return { username: null };
        default:
            return state;
    }
};
