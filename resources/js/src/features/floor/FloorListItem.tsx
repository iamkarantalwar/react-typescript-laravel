import React, { Component, Fragment } from 'react';
import { IProjectFloor, ProjectFloorStatus, ProjectFloorStatusType } from '../../app/models/project-floor.model';
import { ITeam } from '../../app/models/team.model';
import { ProjectFloors, FloorRooms } from '../../app/api/agent';
import { Accordion, Button, Collapse } from 'react-bootstrap';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import RoomListItem from '../room/RoomListItem';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';
import { AxiosError } from 'axios';
import { RootState, fetchRooms } from '../../redux';
import { connect } from 'react-redux';
import LoaderBar from '../../app/common/LoaderBar';
import { withTranslation, WithTranslation } from 'react-i18next';
import RoomForm from '../room/RoomForm';

const mapStateToProps = (state: RootState) => ({
  rooms: state.rooms,
});

interface IMapDispatchToProps {
  fetchRooms: (floor: IProjectFloor) => void,
}

const mapDispatchToProps: IMapDispatchToProps = { fetchRooms };

type ReduxProps = ReturnType<typeof mapStateToProps> & IMapDispatchToProps & WithTranslation;

interface IProps extends ReduxProps {
    floor: IProjectFloor;
    teams: ITeam[];
    toggleFloor: {id: number, open: boolean};
    selectFloor: (floor: IProjectFloor, open?: boolean) => void;
    afterUpdateFloor: (floor: IProjectFloor) => void;
    deleteFloor: (floor: IProjectFloor) => void;
}

interface IState {
    floor: IProjectFloor;
    message: string;
    messageClass: string;
    editFloor:boolean;
    showRooms: boolean;
    rooms: IFloorRoom[];
    showLoader: boolean;
    showRoomForm: boolean;
    toggleRooms: Array<{id: number, open:boolean}>;
}

class FloorListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = {
        floor: {
          ...this.props.floor
        },
        message: "",
        messageClass: "",
        editFloor: false,
        showRooms: false,
        rooms: [],
        showLoader: false,
        showRoomForm: false,
        toggleRooms: [],
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
      this.setState({showLoader: true});

      ProjectFloors
      .updateProjectFloor(this.state.floor)
      .then((res) => {
        this.setState({
          message: "Etage erfolgreich aktualisiert",
          messageClass: "text-success",
          editFloor:false
        });
        this.props.afterUpdateFloor(res);
        setTimeout(()=>{ this.setState({message: "", messageClass: ""})},2000);
      })
      .catch((error: AxiosError) =>{
        let message = 'Etwas ist schief gelaufen';

        if(error.response?.status==422) {
            let error_bags = error.response.data.errors;
            if(error_bags != undefined) {
              message = error_bags.status != undefined ? error_bags.status[0] : message;
            }
        }
        this.setState({
          message: message,
          messageClass: "text-danger",
          floor: this.props.floor
        });

        setTimeout(()=>{ this.setState({message: "", messageClass: ""})}, 2000);
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

    afterAddOfSections(sections: ISection[]) {

    }

    deleteFloor = (floor: IProjectFloor) => {
      let confirm_: any = confirm("Möchten Sie diese Etage wirklich löschen?");
      if(confirm_) {
          ProjectFloors
          .deleteProjectFloor(floor)
          .then((res) => {
              this.setState({
                message: 'Etage erfolgreich gelöscht.',
                messageClass: 'text-danger'
              })
          });
          setTimeout(()=>{ this.props.deleteFloor(floor); },2000);
      }
    }

    hideRoomForm = () => {
      this.setState({showRoomForm: false});
    }

    toggleCollapse = (target: any) => {
      if (target.tagName == 'DIV' || (target.tagName == 'INPUT' && !this.state.editFloor))
      {
        !this.props.toggleFloor?.open ? this.props.fetchRooms(this.props.floor) : "";
        this.setState({showRoomForm:false, showRooms: true});
        this.props.selectFloor(this.props.floor);
      }
    }

    componentDidUpdate(prevState: any) {
      if(prevState.rooms.loader == true && this.props.rooms.loader == false)
      {
        const toggleRooms = this.props.rooms.rooms.map((room) => {return {id: parseInt(room.id), open:false} });
        this.setState({toggleRooms: toggleRooms})
      }
    }

    toggleSectionsList = (open?: boolean) => {
      !this.props.toggleFloor?.open ? this.props.fetchRooms(this.props.floor) : "";
      this.setState({showRoomForm:false, showRooms: open == undefined ? true : open});
      this.props.selectFloor(this.props.floor);
    }


    componentDidMount() {
     //this.props.fetchRooms(this.props.floor);

      // FloorRooms.getFloorRooms(this.props.floor)
      // .then((res) => this.setState({rooms: res}))
      // .catch((errors) => console.log(errors));
    }

    render() {
      let roomsList = this.props.rooms.rooms.length>0 ? this.props.rooms.rooms.map((room, index) => {
        return(
          <RoomListItem
            room={room as IFloorRoom}
            key={index}
            toggleRoom={this.state.toggleRooms[index]}
            afterUpdateRoom={this.afterUpdateRoom}
          />
        )
      }) : <h4 className="ml-5 mb-2">Keine Zimmer verfügbar.</h4>;
      return (
        <Fragment>
          {
            this.state.showLoader ? <LoaderBar/> :
            <div className='mb-2'>
               <div
                className={`floor-one-box card-header d-flex align-items-center justify-content-between cursor-pointer
                            ${this.state.messageClass == 'text-danger' ? 'border border-danger' : ''}
                            ${this.state.messageClass == 'text-success' ? 'border border-success' : ''}`}
                onClick={(e) => this.toggleCollapse(e.target)}
               >
                 <div className="floors-tittle">

                     <h6 className="mb-0">
                       <input
                           type='text'
                           value={this.state.floor.floor_name}
                           readOnly={!this.state.editFloor}
                           className={`form-control ${!this.state.editFloor ? 'team-input cursor-pointer' : ''}`}
                           onChange={(e) => userObject.role == UserRoles.ADMIN ? this.setState({floor: {...this.state.floor,floor_name: e.target.value}}): ""}
                       />
                       </h6>
                 </div>
                 <div className="floor-overviwe-btn d-flex align-items-center">
                         <div className="team-btn mr-1">
                             <select
                               name="team"
                               defaultValue={this.props.floor.status}
                               className={`status-select border border-${this.getStatusCssClass()}`}
                               onChange={this.statusChangeHandler}
                             >
                               <option value={undefined}>{t('Select status')}</option>
                               {
                                 Object.entries(ProjectFloorStatus).map(([key, value]) => <option key={key} value={value}> {t(value)} </option>)
                               }
                             </select>
                         </div>
                         {
                           userObject.role == UserRoles.ADMIN ?
                         <Fragment>
                         <div className="team-btn mr-1">
                             <select
                               name="team"
                               value={this.state.floor.team_id || ''}
                               className="team-select"
                               onChange={this.teamChangeHandler}
                             >
                              <option value=''>{t('Select team')}</option>
                               {
                                 this.props.teams.map((team) => <option key={team.id} value={team.id}> {team.team_name} </option>)
                               }
                             </select>
                         </div>
                         <div className="room-btn">
                           <a
                             href={void(0)}
                             className="overview-flor-btn bg-transparent"
                             onClick={(e) => {
                                this.setState({
                                  showRoomForm: !this.state.showRoomForm,
                                  showRooms: false
                                });
                                this.props.selectFloor(this.props.floor, false);
                            }}
                           >
                             <span><i className={`fa ${this.state.showRoomForm ? 'fa-minus' : 'fa-plus'} room-form-icon`} aria-hidden="true"></i></span>Räume
                           </a>
                         </div>
                         <div className="room-btn">
                            <i
                              style={{cursor:'pointer'}}
                              onClick={(e) => {this.deleteFloor(this.props.floor);this.props.selectFloor(this.props.floor);}}
                              className="fa fa-trash ml-2" aria-hidden="true">
                            </i>
                         </div>
                         </Fragment>
                       : ""}
                         <div className="room-btn">
                           <i style={{cursor:'pointer'}} onClick={this.state.editFloor? this.onSubmitHandler : this.enableEditFloor} className={`fa ${this.state.editFloor ? 'fa-check' : 'fa-pencil'} ml-2`}></i>
                         </div>
                         <div
                          className="room-btn"
                          onClick={(e) => {
                           this.toggleSectionsList(true)
                          }}
                          aria-controls={`collapse${this.props.floor.id}`}
                          aria-expanded={this.state.showRooms}
                        >
                          <i style={{cursor:'pointer'}} className={`fa ${this.props.toggleFloor?.open ? 'fa-angle-down' : 'fa-angle-up' } font-weight-bold ml-2`}></i>
                         </div>
                 </div>

               </div>
               {
                 this.state.message ? <span className={this.state.messageClass}>{this.state.message}</span> : ""
               }
                <Collapse in={this.props.toggleFloor?.open && this.state.showRooms}>
                  <div className=" collapse" id={`collapse${this.props.floor.id}`}>
                  {
                    this.props.rooms.loader ? <LoaderBar/> : roomsList
                  }
                  </div>
                </Collapse>
            </div>
          }
           { this.state.showRoomForm == true ? <RoomForm hideRoomForm={this.hideRoomForm} afterRoomsAdded={this.toggleRoomsList} floor={this.state.floor}/> : "" }
          </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(FloorListItem));
