import React, { Component, Fragment } from 'react';
import { IProjectFloor, ProjectFloorStatus, ProjectFloorStatusType } from '../../app/models/project-floor.model';
import { ITeam } from '../../app/models/team.model';
import { ProjectFloors, FloorRooms } from '../../app/api/agent';
import { Accordion,Button,Card } from 'react-bootstrap';
import RoomListItem from '../room/RoomListItem';
import { IFloorRoom } from '../../app/models/floor-room.model';

interface IProps {
    floor: IProjectFloor;
    teams: ITeam[];
    selectFloor: (floor: IProjectFloor) => void;
    afterUpdateFloor: (floor: IProjectFloor) => void;
}

interface IState {
    floor: IProjectFloor;
    message: string;
    messageClass: string;
    editFloor:boolean;
    showRooms: boolean;
    rooms: IFloorRoom[];
    showLoader: boolean;
}

class FloorListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = {
        floor: this.props.floor,
        message: "",
        messageClass: "",
        editFloor: false,
        showRooms: false,
        rooms: [],
        showLoader: false,
      }
    }

    enableEditFloor = (event:any) => {
        this.setState({
          editFloor: true,
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

    onSubmitHandler = (event: any) => {

      ProjectFloors
      .updateProjectFloor(this.state.floor)
      .then((res) => {
        this.setState({
          message: "Floor Changed Successfully",
          messageClass: "text-success",
          editFloor:false,
          showLoader:true,
        });
        this.props.afterUpdateFloor(res);
        setTimeout(()=>{ this.setState({message: "", messageClass: ""})},2000);
      })
      .catch((error) =>{
        this.setState({
          message: "Something Went Wrong.",
          messageClass: "text-danger"
        });
       
        setTimeout(()=>{ this.setState({message: "", messageClass: ""})},2000);
      })
      .finally(()=>{
        this.setState({
          showLoader:false,
        })
      })
    }

    statusChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      let data:IProjectFloor = this.state.floor;
      Object.entries(ProjectFloorStatus).forEach((value: [string, ProjectFloorStatus]) => {
          if(value[1] == event.target.value)
          {
              data.status = value[1];
              this.setState({
                floor: {...this.state.floor, status: value[1]},
                editFloor: true
              });
          }         
      })
    }

    teamChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      this.setState({
        floor: {...this.state.floor, team_id: (event.target.value)},
        editFloor: true
      });
    }

    afterUpdateRoom = (room: IFloorRoom) => {
        let old_rooms = this.state.rooms as IFloorRoom[];
        let rooms = old_rooms.map((item) => {
            if(room.id == item.id)
            {
              return room;
            }
            else {
              return item;
            }
        });

        this.setState({rooms: rooms});
    }

    componentDidMount() {
      FloorRooms.getFloorRooms(this.props.floor)
      .then((res) => this.setState({rooms: res}))
      .catch((errors) => console.log(errors));
    }

    render() {
        return (
          <Accordion>
           <div className='mb-2'>
              <div className={`floor-one-box card-header d-flex align-items-center justify-content-between ${this.state.messageClass == 'text-danger' ? 'border border-danger' : ''} ${this.state.messageClass == 'text-success' ? 'border border-success' : ''}`}>
                <div className="floors-tittle">
                  
                    <h6 className="mb-0"> 
                      <input 
                          type='text'
                          value={this.state.floor.floor_name}
                          readOnly={!this.state.editFloor}
                          className={`form-control ${!this.state.editFloor ? 'team-input' : ''}`}
                          onChange={(e) => this.setState({floor: {...this.state.floor,floor_name: e.target.value}})}
                      />
                      </h6>
                
                </div>
                <div className="floor-overviwe-btn d-flex align-items-center">
                        <div className="team-btn mr-1">
                            <select 
                              name="team" 
                              value={this.props.floor.status || ''} 
                              className={`status-select border border-${this.getStatusCssClass()}`}
                              onChange={this.statusChangeHandler}
                            >
                              <option value={undefined}>Select Status</option>
                              {
                                Object.entries(ProjectFloorStatus).map(([key, value]) => <option key={key} value={value}> {value} </option>)
                              }
                            </select>
                        </div>
                        <div className="team-btn mr-1">
                            <select 
                              name="team" 
                              value={this.state.floor.team_id || ''} 
                              className="team-select"
                              onChange={this.teamChangeHandler}
                            >
                             <option value=''>Select Team</option>
                              {
                                this.props.teams.map((team) => <option key={team.id} value={team.id}> {team.team_name} </option>)
                              }
                            </select>
                        </div>
                        <div className="room-btn">
                          <a href='#room-form'
                             className="overview-flor-btn bg-transparent"
                             onClick={(e) => this.props.selectFloor(this.props.floor)}
                          >
                            <span><i className="fa fa-plus" aria-hidden="true"></i></span> Room
                          </a>
                        </div>
                        <div className="room-btn">
                          <i style={{cursor:'pointer'}} onClick={this.state.editFloor? this.onSubmitHandler : this.enableEditFloor} className={`fa ${this.state.editFloor ? 'fa-check' : 'fa-pencil'} ml-2`}></i>
                        </div>
                        <div className="room-btn" onClick={(e) => this.setState({showRooms: !this.state.showRooms})}>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            {this.state.rooms.length > 0 ?
                                <i className={`fa ${this.state.showRooms ? 'fa-angle-down' : 'fa-angle-up' } font-weight-bold ml-2`}></i>
                              : "" }
                          </Accordion.Toggle>                           
                	      </div>
                </div>
                
  	          </div>
              {
                this.state.message ? <span className={this.state.messageClass}>{this.state.message}</span> : ""
              }
              
                
                <Accordion.Collapse eventKey="0">
                <Fragment>
                {
                    this.state.rooms.map((room, index) => {
                        return(
                          <RoomListItem 
                            room={room as IFloorRoom}
                            key={index}
                            afterUpdateRoom={this.afterUpdateRoom}
                          />                            
                        )
                    })
                }
                </Fragment>
                 </Accordion.Collapse>  
              
           </div>
           </Accordion>
        );
    }
}

export default FloorListItem;
