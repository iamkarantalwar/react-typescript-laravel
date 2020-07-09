import { ITap } from "./tap.model";

export interface IFloorRoom {
    id: string;
    floor_id: string;
    room_name: string;
    taps?: ITap[];
}