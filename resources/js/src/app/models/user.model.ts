import { ITeam } from "./team.model";
import {IRole} from './role.model';

export interface IUserRole {
    role_name: string;
}

export interface IUser {
    id?:number;
    name: string;
    email: string;
    password: string;
    shortcode: string;
    team_id: string | number | null;
    role: IUserRole | IRole;
    team?:ITeam;
    role_name?:string;
}