import { AUTHENTICATE, DEAUTHENTICATE } from '../types';

const initialState = {
    token: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "save_company_name":
            return { companyName: action.payload };
        case "remove_company_name":
            return { companyName: null };
        default:
            return state;
    }
};
