import { FETCH_USER_FAIL, FETCH_USER_REQUEST, FETCH_USER_SUCCESS } from './userType';
import { IUser } from '../../app/models/user.model';
import Axios, { AxiosResponse, AxiosError } from 'axios';
import {enviorment} from '../../../enviorment';
import { Dispatch } from 'react';



export const fetchUser = () => {
    return (dispatch: Dispatch<any>) => {
        dispatch(fetchUserRequest());
        Axios.get<IUser>(`${enviorment.baseUrl}/user`)
        .then((res) =>dispatch(fetchUserSuccess(res.data)))
        .catch((err: AxiosError) => dispatch(fetchUserFail(err.message)));
    }
}

export const fetchUserRequest = () => {
    return {
        type: FETCH_USER_REQUEST
    }
}

export const fetchUserSuccess = (user:  IUser) => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: user
    }
}

export const fetchUserFail = (error:  string) => {
    return {
        type: FETCH_USER_SUCCESS,
        message: error
    }
}