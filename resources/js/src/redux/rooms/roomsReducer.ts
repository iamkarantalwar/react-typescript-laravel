import { FETCH_ROOMS_FAIL, FETCH_ROOMS_REQUEST, FETCH_ROOMS_SUCCESS } from './roomsType';

interface RoomReducerState {
    loader: boolean,
    rooms: any[],
    error: '',
}

const initialState : RoomReducerState = {
    loader: true,
    rooms: [],
    error: '',
}

const roomsReducer = (state=initialState, action: any) => {
    switch(action.type) {       
        case FETCH_ROOMS_REQUEST: return {
                                    ...state,
                                    loader: true
                                }
        case FETCH_ROOMS_SUCCESS:{ return {
                                    ...state,
                                    loader: false,
                                    rooms: action.payload
                                }}
        case FETCH_ROOMS_FAIL : return {
                                    ...state,
                                    loader: false,
                                    error: action.message
                                }
        default: return state;
    }
}

export default roomsReducer;