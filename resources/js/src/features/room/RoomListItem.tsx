import React, { Component, Fragment } from 'react';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { FloorRooms } from '../../app/api/agent';
import { Accordion, Button } from 'react-bootstrap';
import TapListItem from '../tap/TapListItem';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';


interface IProps {
    room: IFloorRoom;
    afterUpdateRoom: (room :IFloorRoom) => void;
}

interface IState {
    room: IFloorRoom;
    editRoom: boolean;
    showTaps: boolean;
    tapDetecting: boolean;
}

class RoomListItem extends Component<IProps,IState> {
    constructor(props: IProps) {
        super(props);
        this.state= {
            room: this.props.room,
            editRoom: false,
            showTaps: false,
            tapDetecting: false,
        }
    }

    toggleTapDetecting = () => {
        this.setState({tapDetecting: !this.state.tapDetecting});
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
                <Accordion>
                    <div id=""  className="floor-card" style={{padding: '0 2rem !important'}}>
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
                                        <div className="room-edit-btn ">
                                            {
                                                userObject.role == UserRoles.ADMIN ?
                                                <a href={void(0)} className="text-dark" onClick={(e) => !this.state.editRoom ? this.setState({editRoom: true}) : this.updateRoomHandler(e) }>
                                                    <i className={`fa ${!this.state.editRoom ? 'fa-pencil' : 'fa-check' }`} aria-hidden="true"></i>
                                                </a> : ""
                                            }                                            
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={(e)=> this.setState({showTaps: !this.state.showTaps})}>
                                                <i className={`fa ${this.state.showTaps ? 'fa-angle-down' : 'fa-angle-up' } font-weight-bold ml-2`}></i>
                                            </Accordion.Toggle>   
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Accordion.Collapse eventKey="0">
                        <Fragment>
                        {
                            this.state.showTaps ?
                            <Fragment>
                            {
                                this.props.room?.taps?.map(tap => {
                                        return <TapListItem 
                                                    key={tap.id} 
                                                    tap={tap}
                                                    tapDetecting={this.state.tapDetecting}
                                                    toggleTapDetecting={this.toggleTapDetecting}/>
                                })
                            }
                            </Fragment> : ""
                        }
                        </Fragment>
                    </Accordion.Collapse>
                </Accordion>
        );
    }
}

export default RoomListItem;
