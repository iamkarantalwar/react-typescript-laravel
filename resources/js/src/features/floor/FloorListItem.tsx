import React, { Component, Fragment } from 'react';
import { IProjectFloor, ProjectFloorStatus } from '../../app/models/project-floor.model';
import { ITeam } from '../../app/models/team.model';
import { ProjectFloors } from '../../app/api/agent';

interface IProps {
    floor: IProjectFloor;
    teams: ITeam[];
}

interface IState {
    floor: IProjectFloor;
    message: string;
    messageClass: string;
}

class FloorListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = {
        floor: this.props.floor,
        message: "",
        messageClass: "",
      }
    }
    
    getStatusCssClass = () : string => {
      if(this.props.floor.status == ProjectFloorStatus.PENDING) {
        return 'primary';
      } else if(this.props.floor.status == ProjectFloorStatus.INPROGRESS) {
        return 'warning';
      } else {
        return 'success';
      }
    }

    teamChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      this.setState({
        floor: {...this.state.floor, team_id: parseInt(event.target.value)}
      });

      ProjectFloors
      .updateProjectFloor(this.state.floor)
      .then((res) => {
        this.setState({
          message: "Team Changed Successfully",
          messageClass: "text-success"
        });
        setTimeout(()=>{ this.setState({message: "", messageClass: ""})},2000);
      })
      .catch((error) =>{
        this.setState({
          message: "Something Went Wrong.",
          messageClass: "text-danger"
        });
        setTimeout(()=>{ this.setState({message: "", messageClass: ""})},2000);
      })
    }

    render() {
        return (
           <div className='mb-2'>
              <div className={`floor-one-box card-header d-flex align-items-center justify-content-between ${this.state.messageClass == 'text-danger' ? 'border border-danger' : ''} ${this.state.messageClass == 'text-success' ? 'border border-success' : ''}`}>
                <div className="floors-tittle">
                  <h6 className="mb-0"> {this.props.floor.floor_name}</h6>
                </div>
                <div className="floor-overviwe-btn d-flex align-items-center">
                        <div className="ausstehend-btn">
                          <a href="#" className={`overview-flor-btn border border-${this.getStatusCssClass()}`}>{this.props.floor.status}</a>
                        </div>
                        <div className="team-btn mr-1">
                            <select 
                              name="team" 
                              defaultValue={this.props.floor.team_id} 
                              className="team-select"
                              onChange={this.teamChangeHandler}
                            >
                              <option value={undefined}>Select Team</option>
                              {
                                this.props.teams.map((team) => <option key={team.id} value={team.id}> {team.team_name} </option>)
                              }
                            </select>
                        </div>
                        <div className="room-btn">
                          <a href="#" className="overview-flor-btn bg-transparent"><span><i className="fa fa-plus" aria-hidden="true"></i></span> Room</a>
                        </div>
                </div>
                
  	          </div>
              {
                this.state.message ? <span className={this.state.messageClass}>{this.state.message}</span> : ""
              }
              
           </div>
        );
    }
}

export default FloorListItem;
