import { ITap } from "./tap.model";

export interface IFloorRoom {
    id: string;
    section_id: string;
    room_name: string;
    taps?: ITap[];
}
