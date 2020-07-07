import axios, { AxiosResponse } from 'axios';
import { IProject } from '../models/project.model';
import {enviorment} from '../../../enviorment';
import { ITeam } from '../models/team.model';
import { IUser } from '../models/user.model';
import { IRole } from '../models/role.model';
import { IProjectSetting } from '../models/project-setting.model';
import { IProjectFloorForm } from '../models/project-floor-form.model';
import { IProjectFloor } from '../models/project-floor.model';
import { IRoomType } from '../models/room-type';
import { IRoomForm } from '../models/room-form.model';
import { IFloorRoom } from '../models/floor-room.model';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('token');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config
}, error => {
return Promise.reject(error);
})

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
    roomTypes: 'room-types',
    floorRooms: 'floor-rooms'
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
    fetchUser: () : Promise<IUser> => requests.get(`${enviorment.baseUrl}/usera`),
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
    getProjectFloors: (project: IProject) : Promise<IProjectFloor[]> => requests.get(`${enviorment.baseUrl}/${endPoints.projectFloor}?project_id=${project.id}`),
    saveProjectFloor: (projectFloorForm: IProjectFloorForm): Promise<IProjectFloor[]> => requests.post(`${enviorment.baseUrl}/${endPoints.projectFloor}`, projectFloorForm),
    updateProjectFloor: (floor: IProjectFloor): Promise<IProjectFloor> => requests.put(`${enviorment.baseUrl}/${endPoints.projectFloor}/${floor.id}`, floor),
    deleteProjectFloor: (floor: IProjectFloor)  => requests.del(`${enviorment.baseUrl}/${endPoints.projectFloor}/${floor.id}`),
}

export const RoomType = {
    getRoomTypes: () : Promise<IRoomType[]> => requests.get(`${enviorment.baseUrl}/${endPoints.roomTypes}`)
}

export const FloorRooms = {
    getFloorRooms: (projectFloor: IProjectFloor) => requests.get(`${enviorment.baseUrl}/${endPoints.floorRooms}?floor_id=${projectFloor.id}`),
    saveFloorRooms : (floorRooms: IRoomForm) => requests.post(`${enviorment.baseUrl}/${endPoints.floorRooms}`, floorRooms), 
    updateFloorRoom : (floorRoom: IFloorRoom): Promise<IFloorRoom> => requests.put(`${enviorment.baseUrl}/${endPoints.floorRooms}/${floorRoom.id}`, floorRoom),
}
