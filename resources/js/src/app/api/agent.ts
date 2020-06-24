import axios, { AxiosResponse } from 'axios';
import { IProject } from '../models/project.model';
import {enviorment} from '../../../enviorment';
import { ITeam } from '../models/team.model';

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
}

export const Project = {
    getProjects: (): Promise<IProject[]> => requests.get(`${enviorment.baseUrl}/${endPoints.project}`),
    saveProject: (project: IProject): Promise<IProject> => requests.post(`${enviorment.baseUrl}/${endPoints.project}`, project),
}

export const Team = {
    getTeams: ():Promise<ITeam[]> => requests.get(`${enviorment.baseUrl}/${endPoints.team}`),
    saveTeam: (team: ITeam):Promise<ITeam> => requests.post(`${enviorment.baseUrl}/${endPoints.team}`, team)
}