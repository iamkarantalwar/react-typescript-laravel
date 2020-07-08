import { CHANGE_TITLE } from "./webTitleType";

const initialState = {
    title: null,
}


function webTitleReducer(state=initialState, action: any) {
    switch (action.type) {
        case CHANGE_TITLE:
            return {
                ...state,
                title: action.payload
            };
    
        default:
            return state;
    }
}

export default webTitleReducer;