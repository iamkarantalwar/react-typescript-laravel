import axios, { AxiosResponse } from 'axios';
import AxiosObservable from 'axios-observable';
import { IProject } from '../models/project.model';
import {enviorment} from '../../../enviorment';
import { ITeam } from '../models/team.model';
import { IUser } from '../models/user.model';
import { IRole } from '../models/role.model';
import { IProjectSetting } from '../models/project-setting.model';
import { IProjectFloorForm } from '../models/project-floor-form.model';
import { IProjectFloor } from '../models/project-floor.model';
import { IRoomType } from '../models/room-type.model';
import { IRoomForm } from '../models/room-form.model';
import { IFloorRoom } from '../models/floor-room.model';
import { ITapStatic } from '../models/tap-static.model';
import { ITap } from '../models/tap.model';
import { ITapTimer } from '../models/tap-timer.model';
import { SettingsField } from '../enums/settings-field.enum';
import { Observable } from 'rxjs';
import { lazy } from 'react';
import { ISection } from '../models/section.model';
import { env } from 'process';
import { ISectionForm } from '../form/section.form';
import { IPumpstartOfProduct } from '../models/pumpstart-of-product.model';

const responseBody = (response: AxiosResponse) => response.data;

// axios.interceptors.request.use((config) => {
//     const token = window.localStorage.getItem('token');
//     if(token) config.headers.Authorization = `Bearer ${token}`;
//     return config
// }, error => {
// return Promise.reject(error);
// })

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
};

const lazyLoadRequest = {
    get: (url: string) => AxiosObservable.get(url),
    post: (url: string, body: {}) => AxiosObservable.post(url, body),
    put: (url: string, body: {}) => AxiosObservable.put(url, body),
    del: (url: string) => AxiosObservable.delete(url),
}

export const endPoints = {
    project: 'project',
    team: 'team',
    user: 'user',
    role: 'userroles',
    projectSettings: 'project-settings',
    projectFloor: 'project-floors',
    roomTypes: 'room-types',
    floorRooms: 'floor-rooms',
    tapStatics: 'tap-statics',
    tapRounds: 'tap-rounds',
    sections: 'sections',
    taps: 'taps',
    pumpstart: 'pumpstart-of-products'
}

export const Project = {
    getProject: (projectId: string): Promise<IProject> => requests.get(`${enviorment.baseUrl}/${endPoints.project}?project_id=${projectId}`),
    getProjects: (): Promise<IProject[]> => requests.get(`${enviorment.baseUrl}/${endPoints.project}`),
    saveProject: (project: IProject): Promise<IProject> => requests.post(`${enviorment.baseUrl}/${endPoints.project}`, project),
    deleteProject: (project: IProject): Promise<boolean> => requests.del(`${enviorment.baseUrl}/${endPoints.project}/${project.id}`)
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
    getProjectSetting: (settingId: string) : Promise<IProjectSetting> => requests.get(`${enviorment.baseUrl}/${endPoints.projectSettings}/${settingId}`),
    deleteProjectSetting: (ProjectSetting: IProjectSetting) : Promise<any> => requests.del(`${enviorment.baseUrl}/${endPoints.projectSettings}/${ProjectSetting.id}`),
    createProjectSetting: (projectSetting: IProjectSetting): Promise<IProjectSetting> => requests.post(`${enviorment.baseUrl}/${endPoints.projectSettings}`, projectSetting),
    updateProjectSetting: (projectSetting: IProjectSetting): Promise<IProjectSetting> => requests.put(`${enviorment.baseUrl}/${endPoints.projectSettings}/${projectSetting.id}`, projectSetting),
    getProjectSettings: (projectId: string) : Promise<IProjectSetting[]> => requests.get(`${enviorment.baseUrl}/${endPoints.project}/${projectId}/settings`),
    saveProjectSettings: (projectSettings: IProjectSetting[], projectId: string) : Promise<IProjectSetting[]> => requests.put(`${enviorment.baseUrl}/${endPoints.project}/${projectId}/settings `, projectSettings),
}

export const ProjectFloors = {
    getAllFloors: () : Promise<IProjectFloor[]> => requests.get(`${enviorment.baseUrl}/${endPoints.projectFloor}`),
    getProjectFloors: (projectId: string) : Promise<IProjectFloor[]> => requests.get(`${enviorment.baseUrl}/${endPoints.projectFloor}?project_id=${projectId}`),
    saveProjectFloor: (projectFloorForm: IProjectFloorForm): Promise<IProjectFloor[]> => requests.post(`${enviorment.baseUrl}/${endPoints.projectFloor}`, projectFloorForm),
    updateProjectFloor: (floor: IProjectFloor): Promise<IProjectFloor> => requests.put(`${enviorment.baseUrl}/${endPoints.projectFloor}/${floor.id}`, floor),
    deleteProjectFloor: (floor: IProjectFloor)  => requests.del(`${enviorment.baseUrl}/${endPoints.projectFloor}/${floor.id}`),
}

export const RoomType = {
    getRoomTypes: () : Promise<IRoomType[]> => requests.get(`${enviorment.baseUrl}/${endPoints.roomTypes}`),
    saveRoomType: (roomType: IRoomType) : Promise<IRoomType> => requests.post(`${enviorment.baseUrl}/${endPoints.roomTypes}`, roomType),
    updateRoomType: (roomType: IRoomType) : Promise<IRoomType> => requests.put(`${enviorment.baseUrl}/${endPoints.roomTypes}/${roomType.id}`, roomType),
    deleteRoomType: (roomType: IRoomType) : Promise<any> => requests.del(`${enviorment.baseUrl}/${endPoints.roomTypes}/${roomType.id}`)
}

export const FloorRooms = {
    getAllRooms: () : Promise<IFloorRoom[]> => requests.get(`${enviorment.baseUrl}/${endPoints.floorRooms}`),
    getFloorRooms: (projectFloor: IProjectFloor): Promise<IFloorRoom[]> => requests.get(`${enviorment.baseUrl}/${endPoints.floorRooms}?floor_id=${projectFloor.id}`),
    saveFloorRooms : (floorRooms: IRoomForm) => requests.post(`${enviorment.baseUrl}/${endPoints.floorRooms}`, floorRooms),
    updateFloorRoom : (floorRoom: IFloorRoom): Promise<IFloorRoom> => requests.put(`${enviorment.baseUrl}/${endPoints.floorRooms}/${floorRoom.id}`, floorRoom),
    deleteFloorRoom: (floorRoom: IFloorRoom) => requests.del(`${enviorment.baseUrl}/${endPoints.floorRooms}/${floorRoom.id}`),
}

export const TapStatic = {
    createTapStatic : (stat: ITapStatic) : Promise<ITapStatic> => requests.post(`${enviorment.baseUrl}/${endPoints.tapStatics}`, stat),
    getTapStatics: (tapId: string | number): Promise<ITapStatic[]> => requests.get(`${enviorment.baseUrl}/${endPoints.tapStatics}?tap_id=${tapId}`),
    updateTapStatic: (stat: ITapStatic): Promise<ITapStatic> => requests.put(`${enviorment.baseUrl}/${endPoints.tapStatics}/${stat.id}`, stat),
}

export const TapTimer = {
    getTapTimers: (tap: ITap): Promise<ITapTimer[]> => requests.get(`${enviorment.baseUrl}/${endPoints.tapRounds}?tap_id=${tap.id}`),
    saveTapTimers: (timers: ITapTimer[]) : Promise<ITapTimer[]> => requests.post(`${enviorment.baseUrl}/${endPoints.tapRounds}`, timers),
    updateTapTimer: (timer: ITapTimer): Promise<ITapTimer> => requests.put(`${enviorment.baseUrl}/${endPoints.tapRounds}/${timer.id}`, timer),
    startTapTimer: (field: SettingsField, timer: ITapTimer): Promise<ITapTimer> => requests.put(`${enviorment.baseUrl}/${endPoints.tapRounds}/start-timer/${timer.id}`, {'field': field}),
}

export const TapTimerObservable = {
    getTapTimers: (tap: ITap)   => lazyLoadRequest.get(`${enviorment.baseUrl}/${endPoints.tapRounds}?tap_id=${tap.id}`),
}

export const TapStaticObservable = {
    getTapTimers: (tap: ITap) => lazyLoadRequest.get(`${enviorment.baseUrl}/${endPoints.tapRounds}?tap_id=${tap.id}`),
}


export const Section = {
    sections: (floor_id: string): Promise<ISection[]> => requests.get(`${enviorment.baseUrl}/${endPoints.sections}?floor_id=${floor_id}`),
    addSection : (section: ISectionForm) : Promise<ISection[]> => requests.post(`${enviorment.baseUrl}/${endPoints.sections}`, section),
    updateSection: (section: ISection): Promise<ISection> => requests.put(`${enviorment.baseUrl}/${endPoints.sections}/${section.id}`, section),
}

export const Tap = {
    updateTap : (tap: ITap) : Promise<ITap> => requests.put(`${enviorment.baseUrl}/${endPoints.taps}/${tap.id}`, tap),
    deleteTap: (tap: ITap) : Promise<any> => requests.del(`${enviorment.baseUrl}/${endPoints.taps}/${tap.id}`),
}

export const PumpStart = {
    getProjectPumpStart : (project_id: string) : Promise<IPumpstartOfProduct[]> => requests.get(`${enviorment.baseUrl}/${endPoints.pumpstart}?project_id=${project_id}`),
    createProjectPumpStart: (pumpstart: IPumpstartOfProduct) : Promise<IPumpstartOfProduct>  => requests.post(`${enviorment.baseUrl}/${endPoints.pumpstart}`, pumpstart),
    updatePumpStart: (pumpstart: IPumpstartOfProduct) : Promise<IPumpstartOfProduct> => requests.put(`${enviorment.baseUrl}/${endPoints.pumpstart}/${pumpstart.id}`, pumpstart),
    deletePumpStart: (pumpstart: IPumpstartOfProduct) : Promise<any> => requests.del(`${enviorment.baseUrl}/${endPoints.pumpstart}/${pumpstart.id}`),
}
