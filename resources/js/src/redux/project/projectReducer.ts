import { EDIT_PROJECT_FORM } from "./projectType";
import { IProject } from "../../app/models/project.model";

interface ProjectReducerState {
    project: IProject,
    active: boolean,
}

const initialState: ProjectReducerState = {
    project: {
        description:"",
        project_name: "",
    },active: false,
}

const projectReducer = (state=initialState, action: any) => {
        switch (action.type) {
            case EDIT_PROJECT_FORM: return {
                                        ...state,
                                        project: action.payload,
                                        active: action.status,
                                    }
            default:
                return state;
        }
}

export default projectReducer;