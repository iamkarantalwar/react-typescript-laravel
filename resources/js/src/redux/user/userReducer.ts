import { FETCH_USER_FAIL, FETCH_USER_REQUEST, FETCH_USER_SUCCESS } from './userType';

const initialState = {
    loader: false,
    name: '',
    email: '',
    api_token:'',
    role: {
        role_name: '',
    },
    error: '',
}

const userReducer = (state=initialState, action: any) => {
    switch(action.type) {
        case FETCH_USER_REQUEST: return {
                                    ...state,
                                    loader: true
                                }
        case FETCH_USER_SUCCESS: return {
                                    ...state,
                                    loader: false,
                                    payload: action.payload
                                }
        case FETCH_USER_FAIL : return {
                                    ...state,
                                    loader: false,
                                    error: action.message
                                }
        default: return state;
    }
}

export default userReducer;