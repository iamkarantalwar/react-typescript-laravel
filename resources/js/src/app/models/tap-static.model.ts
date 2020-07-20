import { IProjectSetting } from "./project-setting.model";
import { IUser } from "./user.model";

export interface ITapStatic {
    id?: number;
    tap_round_id?: 1;
    taps_id: number;
    project_setting_id: number;
    user_id?: number;
    detected: boolean;
    setting?: IProjectSetting;
    user?: IUser;
    created_at?:Date;
    date?:string;
    time?:string;
}