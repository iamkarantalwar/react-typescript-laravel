import { FETCH_USERS_FAIL, FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS } from './userType';
import { IUser } from '../../app/models/user.model';

interface UserReducerState {
    loader: boolean;
    users: IUser[],
    error: string;
}

const initialState :UserReducerState = {
    loader: false,
    users: [],
    error: '',
}

const usersReducer = (state:UserReducerState = initialState, action: any) => {
    switch(action.type) {
        case FETCH_USERS_REQUEST: return {
                                    ...state,
                                    loader: true
                                }
        case FETCH_USERS_SUCCESS: return {
                                    ...state,
                                    loader: false,
                                    users: action.payload as IUser[]
                                }
        case FETCH_USERS_FAIL : return {
                                    ...state,
                                    loader: false,
                                    error: action.message
                                }
        default: return state;
    }
}

export default usersReducer;