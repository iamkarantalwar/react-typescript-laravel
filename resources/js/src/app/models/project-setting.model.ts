export enum ProjectSettingStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface IProjectSetting {
    id?: number;
    project_id: number;
    field_name: string;
    field_wirkzeit: string;
    field_spulzeit: string;
    aktiv: ProjectSettingStatus
}