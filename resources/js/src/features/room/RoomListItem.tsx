import React, { Component } from 'react';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { FloorRooms } from '../../app/api/agent';


interface IProps {
    room: IFloorRoom;
    afterUpdateRoom: (room :IFloorRoom) => void;
}

interface IState {
    room: IFloorRoom;
    editRoom: boolean;
}

class RoomListItem extends Component<IProps,IState> {
    constructor(props: IProps) {
        super(props);
        this.state= {
            room: this.props.room,
            editRoom: false,
        }
    }

    updateRoomHandler = (event: any) => {
        FloorRooms.updateFloorRoom(this.state.room)
        .then((res) => {
            this.props.afterUpdateRoom(res);
        })
        .catch((error) => console.log(error));

        this.setState({
            editRoom: false,
        });
       
    }

    
    render() {
        return (
            <div id=""  className="floor-card card-body pr-0 pt-2" data-parent="#accordion" style={{padding: '0 2rem !important'}}>
                <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                    <div className="card mb-0 border-0">
                    <div className="card-header  mb-1" data-toggle="collapse" >
                        <div className="main-room-overview d-flex justify-content-between">
                        <div className="overview-floor-list">
                            <a className="card-title">
                                <input
                                    type='text'
                                    className={`form-control ${!this.state.editRoom ? 'team-input' : ''}`}
                                    value={this.state.room.room_name}
                                    readOnly={!this.state.editRoom}
                                    onChange={(e) => this.setState({room:{...this.state.room, room_name: e.target.value}})}
                                />
                            </a>
                        </div>
                        <div className="room-edit-btn mr-4">
                            <a href={void(0)} className="text-dark" onClick={(e) => !this.state.editRoom ? this.setState({editRoom: true}) : this.updateRoomHandler(e) }>
                                <i className={`fa ${!this.state.editRoom ? 'fa-pencil' : 'fa-check' }`} aria-hidden="true"></i>
                            </a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RoomListItem;
