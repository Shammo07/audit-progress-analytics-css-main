import { AUTHENTICATE, DEAUTHENTICATE } from '../types';

const initialState = {
    token: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "save_super_admin":
            return { isSuperAdmin: action.payload };
        case "remove_super_admin":
            return { isSuperAdmin: null };
        default:
            return state;
    }
};
