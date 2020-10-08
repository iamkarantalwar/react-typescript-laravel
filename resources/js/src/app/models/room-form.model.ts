import { IRoomType } from "./room-type.model";

export type RoomDetails = {room_type: IRoomType, quantity: string}


export interface IRoomForm {
    section_id: string;
    name: string;
    quantity: string;
    from: string;
    to: string;
    room_details: Array<RoomDetails>
}
