import axios, { AxiosResponse } from 'axios';
import { IProject } from '../models/project.model';
import {enviorment} from '../../../enviorment';
import { ITeam } from '../models/team.model';
import { IUser } from '../models/user.model';
import { IRole } from '../models/role.model';
import { IProjectSetting } from '../models/project-setting.model';
import { IProjectFloorForm } from '../models/project-floor-form.model';
import { IProjectFloor } from '../models/project-floor.model';

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
};

const endPoints = {
    project: 'project',
    team: 'team',
    user: 'user',
    role: 'userroles',
    projectSettings: 'project-settings',
    projectFloor: 'project-floors',
}

export const Project = {
    getProjects: (): Promise<IProject[]> => requests.get(`${enviorment.baseUrl}/${endPoints.project}`),
    saveProject: (project: IProject): Promise<IProject> => requests.post(`${enviorment.baseUrl}/${endPoints.project}`, project),
}

export const Team = {
    getTeams: ():Promise<ITeam[]> => requests.get(`${enviorment.baseUrl}/${endPoints.team}`),
    saveTeam: (team: ITeam):Promise<ITeam> => requests.post(`${enviorment.baseUrl}/${endPoints.team}`, team),
    updateTeam: (team: ITeam):Promise<ITeam> => requests.put(`${enviorment.baseUrl}/${endPoints.team}/${team.id}`, team),
}

export const User = {
    getUsers: () : Promise<IUser[]> => requests.get(`${enviorment.baseUrl}/${endPoints.user}`),  
    saveUser: (user : IUser) : Promise<IUser> => requests.post(`${enviorment.baseUrl}/${endPoints.user}`, user),  
    updateUser: (user : IUser) : Promise<IUser> => requests.put(`${enviorment.baseUrl}/${endPoints.user}/${user.id}`, user),  
}

export const Role = {
    getRoles: () : Promise<IRole[]> => requests.get(`${enviorment.baseUrl}/${endPoints.role}`),
}

export const ProjectSetting = {
    getProjectSettings: (project: IProject) : Promise<IProjectSetting[]> => requests.get(`${enviorment.baseUrl}/${endPoints.projectSettings}/${project.id}`),
    saveProjectSettings: (projectSettings: IProjectSetting[], project: IProject) : Promise<IProjectSetting[]> => requests.put(`${enviorment.baseUrl}/${endPoints.projectSettings}/${project.id}`, projectSettings), 
}

export const ProjectFloors = {
    saveProjectFloor: (projectFloorForm: IProjectFloorForm): Promise<IProjectFloor[]> => requests.post(`${enviorment.baseUrl}/${endPoints.projectFloor}`, projectFloorForm),
    updateProjectFloor: (floor: IProjectFloor): Promise<IProjectFloor> => requests.put(`${enviorment.baseUrl}/${endPoints.projectFloor}/${floor.id}`, floor)
}

