import {
    FETCH_ROOMS_FAIL,
    FETCH_ROOMS_REQUEST,
    FETCH_ROOMS_SUCCESS,
    ADD_ROOMS, EDIT_ROOM_TAP, DELETE_ROOM_TAP
}
from './roomsType';

import { AxiosError } from 'axios';
import { Dispatch } from 'react';
import { FloorRooms } from '../../app/api/agent';
import { IProjectFloor } from '../../app/models/project-floor.model';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { ITap } from '../../app/models/tap.model';



export const fetchRooms = (floor: IProjectFloor) => {
    return (dispatch: Dispatch<any>) => {
        dispatch(fetchRoomsRequest());
        FloorRooms.getFloorRooms(floor)
        .then((res) => dispatch(fetchRoomsSuccess(res)))
        .catch((err: AxiosError) => dispatch(fetchRoomsFail(err.message)))
    }
}

export const addRooms = (rooms: IFloorRoom[]) => {
    return {
        type: ADD_ROOMS,
        payload: rooms
    }
}

export const fetchRoomsRequest = () => {
    return {
        type: FETCH_ROOMS_REQUEST
    }
}

export const fetchRoomsSuccess = (rooms:  IFloorRoom[]) => {
    return {
        type: FETCH_ROOMS_SUCCESS,
        payload: rooms
    }
}

export const fetchRoomsFail = (error:  string) => {
    return {
        type: FETCH_ROOMS_FAIL,
        message: error
    }
}

export const editRoomTap = (tap: ITap) => {
    return {
        type: EDIT_ROOM_TAP,
        payload: tap
    }
}

export const deleteRoomTap = (tap: ITap) => {
    return {
        type: DELETE_ROOM_TAP,
        payload: tap
    }
}
