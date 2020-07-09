import { EDIT_PROJECT_FORM } from './projectType';
import { IProject } from '../../app/models/project.model';

export const editProjectForm = (project: IProject, status: boolean=true) => {
    return {
        type: EDIT_PROJECT_FORM,
        payload: project,
        status: status
    }
}

