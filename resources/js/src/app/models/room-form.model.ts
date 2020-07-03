import { IRoomType } from "./room-type";

export type RoomDetails = {room_type: IRoomType, quantity: string}


export interface IRoomForm {
    floor_id: string;
    name: string;
    quantity: string;
    from: string;
    to: string;
    room_details: Array<RoomDetails>
}