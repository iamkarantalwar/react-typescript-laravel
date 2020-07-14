import { FETCH_USERS_FAIL, FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS } from './userType';
import { IUser } from '../../app/models/user.model';
import { AxiosError } from 'axios';
import { Dispatch } from 'react';
import { User } from '../../app/api/agent';



export const fetchUsers = () => {
    return (dispatch: Dispatch<any>) => {
        dispatch(fetchUsersRequest());
        User.getUsers()
        .then((res) => dispatch(fetchUsersSuccess(res)))
        .catch((err: AxiosError) => dispatch(fetchUsersFail(err.message)))
    }
}

export const fetchUsersRequest = () => {
    return {
        type: FETCH_USERS_REQUEST
    }
}

export const fetchUsersSuccess = (user:  IUser[]) => {
    return {
        type: FETCH_USERS_SUCCESS,
        payload: user
    }
}

export const fetchUsersFail = (error:  string) => {
    return {
        type: FETCH_USERS_FAIL,
        message: error
    }
}