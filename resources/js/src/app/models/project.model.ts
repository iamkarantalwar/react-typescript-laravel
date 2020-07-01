import { IProjectFloor } from "./project-floor.model";

export interface IProject {
    id?: number;
    floors?: IProjectFloor[];
    project_name: string;
    description: string;
}