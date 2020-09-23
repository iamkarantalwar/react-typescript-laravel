import React, { Component } from 'react';
import { IProjectFloor, ProjectFloorStatus } from '../../app/models/project-floor.model';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';
import { FloorRooms, ProjectFloors } from '../../app/api/agent';
import { AxiosError } from 'axios';

interface IProps {
    floor: IProjectFloor;
    room: IFloorRoom;
    updateListItem : (updatedFloor: IProjectFloor, updatedRoom: IFloorRoom) => void,
    deleteListItem: (deletedRoom: IFloorRoom) => void,
}

interface IState {
    floor: IProjectFloor;
    room: IFloorRoom;
    editable: boolean;
    loader: boolean;
}

class DashboardListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            floor : {
                ...this.props.floor
            },
            room: {
                ...this.props.room
            },
            editable: false,
            loader: false,
        }
    }

    statusChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let data:IProjectFloor = this.state.floor;
        Object.entries(ProjectFloorStatus).forEach((value: [string, ProjectFloorStatus]) => {
            if(value[1] == event.target.value)
            {
                data.status = value[1];
                this.setState({
                  floor: {...this.state.floor, status: value[1]},
                  editable: true
                });
            }
        })
      }

    getStatusCssClass = () : string => {
        if(this.state.floor.status == ProjectFloorStatus.PENDING) {
          return 'primary';
        } else if(this.state.floor.status == ProjectFloorStatus.INPROGRESS) {
          return 'warning';
        } else {
          return 'success';
        }
      }

    onSubmitHandler = () => {
        this.setState({loader: true});

        // Update Floor
        ProjectFloors.updateProjectFloor(this.state.floor)
            .then((res) => {
                alert("Etage erfolgreich aktualisiert");
                //After Updating Floor Update Room
                FloorRooms.updateFloorRoom(this.state.room)
                .then((res) => {
                    this.props.updateListItem(this.state.floor, this.state.room);
                })
                .catch((error) =>{
                    let message = 'Etwas ist schief gelaufen';
                    alert(message);

                });
            })
            .catch((error: AxiosError) =>{
                let message = 'Etwas ist schief gelaufen';
                alert(message);
            })
            .finally(()=>{
                this.setState({
                    loader: false,
                })
            });
      }
    deleteRoom = (room: IFloorRoom) => {
        let conf: boolean = confirm('Are you sure you want to delete this room permenently? ');
        if(conf) {
            FloorRooms.deleteFloorRoom(room)
                .then((res) => { alert('Room Deleted Successfully'); this.props.deleteListItem(room) })
                .catch((res) =>{})
        }
    }

    render() {
        const {floor, room} = this.state;
        return (
            <tr>
                <th scope="row" className="text-left"><i className="fa fa-caret-right text-blue"></i>
                    <input
                        type='text'
                        className={`form-control ${!this.state.editable ? 'team-input cursor-pointer' : ''}`}
                        value={this.state.room.room_name}
                        readOnly={!this.state.editable}
                        onChange={(e) => this.setState({room:{...this.state.room, room_name: e.target.value}})}
                    />
                </th>
                <td className="text-left">
                    <input
                    type='text'
                    value={this.state.floor.floor_name}
                    readOnly={!this.state.editable}
                    className={`form-control ${!this.state.editable ? 'team-input cursor-pointer' : ''}`}
                    onChange={(e) => userObject.role == UserRoles.ADMIN ? this.setState({floor: {...this.state.floor,floor_name: e.target.value}}): ""}
                />
                </td>
                <td className="text-left">
                    <select
                        name="team"
                        defaultValue={this.props.floor.status}
                        className={`status-select border border-${this.getStatusCssClass()}`}
                        onChange={this.statusChangeHandler}
                        >
                        <option value={undefined}>Status auswählen</option>
                        {
                            Object.entries(ProjectFloorStatus).map(([key, value]) => <option key={key} value={value}> {value} </option>)
                        }
                        </select>
                </td>
                <td className="text-left">
                    <i style={{cursor:'pointer'}} onClick={(e) => this.state.editable? this.onSubmitHandler() : this.setState({editable: true})} className={`fa ${this.state.editable ? 'fa-check' : 'fa-pencil'} ml-2`}></i>
                    <i
                        style={{cursor:'pointer'}}
                        onClick={(e) => this.deleteRoom(room)}
                        className="fa fa-trash ml-2" aria-hidden="true"/>
                </td>
            </tr>
        );
    }
}

export default DashboardListItem;
