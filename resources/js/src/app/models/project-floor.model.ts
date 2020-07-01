export enum ProjectFloorStatus {
    PENDING = "Ausstehend",
    INPROGRESS = "In Arbeit",
    FINISHED = "Fertig",
}

export interface IProjectFloor {
    id:number,
    floor_name: string,
    status: ProjectFloorStatus,
    team_id: number
}