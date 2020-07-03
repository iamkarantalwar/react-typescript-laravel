import { IFloorRoom } from "./floor-room.model";

export enum ProjectFloorStatus {
    PENDING = "Ausstehend",
    INPROGRESS = "In Arbeit",
    FINISHED = "Fertig",
}

export type ProjectFloorStatusType = "Ausstehend" | "In Arbeit" | "Fertig";

export interface IProjectFloor {
    id:number,
    floor_name: string,
    status: ProjectFloorStatus,
    team_id: string,
    rooms?: IFloorRoom[]
}