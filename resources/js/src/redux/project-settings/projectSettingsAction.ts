import { 
    FETCH_PROJECTSETTINGS_FAIL,
    FETCH_PROJECTSETTINGS_REQUEST,
    FETCH_PROJECTSETTINGS_SUCCESS
} from "./projectSettingsType";

import { Dispatch } from "redux";
import { IProjectSetting } from "../../app/models/project-setting.model";
import { ProjectSetting } from "../../app/api/agent";
import { AxiosError } from "axios";

export const fetchProjectSettings = (projectId: string) => {
    return (dispatch: Dispatch<any>) => {
        dispatch(fetchProjectSettingsRequest());
        ProjectSetting
        .getProjectSettings(projectId)
        .then((settings) => dispatch(fetchProjectSettingsSuccess(settings)))
        .catch((err: AxiosError) => dispatch(fetchProjectSettingsFail(err.message)))
    }
}

const fetchProjectSettingsRequest = () => {
    return {
        type: FETCH_PROJECTSETTINGS_REQUEST,
    }
}

const fetchProjectSettingsSuccess = (projectSettings: IProjectSetting[]) =>{
    return {
        type: FETCH_PROJECTSETTINGS_SUCCESS,
        payload: projectSettings
    }
}

const fetchProjectSettingsFail = (message: string) => {
    return {
        type: FETCH_PROJECTSETTINGS_FAIL,
        message: message
    }
}