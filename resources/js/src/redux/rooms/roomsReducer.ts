import { FETCH_ROOMS_FAIL, FETCH_ROOMS_REQUEST, FETCH_ROOMS_SUCCESS, ADD_ROOMS } from './roomsType';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { IProjectFloor } from '../../app/models/project-floor.model';


interface RoomReducerState {
    loader: boolean,
    rooms: IFloorRoom[],
    error: '',
}

const initialState : RoomReducerState = {
    loader: true,
    rooms: [],
    error: '',
}

const roomsReducer = (state: RoomReducerState=initialState, action: any) => {
    switch(action.type) {       
        case FETCH_ROOMS_REQUEST: return {
                                    ...state,
                                    loader: true
                                }
        case FETCH_ROOMS_SUCCESS: return {
                                    ...state,
                                    loader: false,
                                    rooms: action.payload as IFloorRoom[]
                                }
        case FETCH_ROOMS_FAIL : return {
                                    ...state,
                                    loader: false,
                                    error: action.message
                                }
        case ADD_ROOMS: return {
                            ...state,
                            rooms:[...state.rooms, ...action.payload as IFloorRoom[]]  
        }
        default: return state;
    }
}

export default roomsReducer;