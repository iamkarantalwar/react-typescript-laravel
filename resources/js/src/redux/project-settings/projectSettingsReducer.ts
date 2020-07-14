import { 
    FETCH_PROJECTSETTINGS_FAIL,
    FETCH_PROJECTSETTINGS_REQUEST,
    FETCH_PROJECTSETTINGS_SUCCESS
} from './projectSettingsType';
import { IProjectSetting } from '../../app/models/project-setting.model';



interface RoomReducerState {
    loader: boolean,
    projectSettings: IProjectSetting[],
    error: '',
}

const initialState : RoomReducerState = {
    loader: true,
    projectSettings: [],
    error: '',
}

const projectSettingsReducer = (state: RoomReducerState=initialState, action: any) => {
    switch(action.type) {       
        case FETCH_PROJECTSETTINGS_REQUEST: return {
                                    ...state,
                                    loader: true
                                }
        case FETCH_PROJECTSETTINGS_SUCCESS: return {
                                    ...state,
                                    loader: false,
                                    projectSettings: action.payload as IProjectSetting[]
                                }
        case FETCH_PROJECTSETTINGS_FAIL : return {
                                    ...state,
                                    loader: false,
                                    error: action.message
                                }
        default: return state;
    }
}

export default projectSettingsReducer;