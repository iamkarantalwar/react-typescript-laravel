import React, { Component, Fragment } from 'react';
import { IProjectFloor, ProjectFloorStatus, ProjectFloorStatusType } from '../../app/models/project-floor.model';
import { ITeam } from '../../app/models/team.model';
import { ProjectFloors, Section } from '../../app/api/agent';
import { Collapse } from 'react-bootstrap';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';
import { AxiosError } from 'axios';
import { RootState, fetchRooms } from '../../redux';
import { connect } from 'react-redux';
import LoaderBar from '../../app/common/LoaderBar';
import { ISection } from '../../app/models/section.model';
import SectionForm from '../sections/SectionForm';
import { withTranslation, WithTranslation } from 'react-i18next';
import SectionListItem from '../sections/SectionListItem';

interface IProps extends WithTranslation {
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
    showSections: boolean;
    sections: ISection[];
    showLoader: boolean;
    showSectionForm: boolean;
    toggleSections: Array<{id: number, open:boolean}>;
    loader: boolean;
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
        showSections: false,
        sections: [],
        showLoader: false,
        showSectionForm: false,
        toggleSections: [],
        loader: false
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

    afterUpdateSection = (section: ISection) => {
        let old_sections = this.state.sections as ISection[];
        let sections = old_sections.map((item) => {
            if(section.id == item.id)
            {
              return section;
            }
            else {
              return item;
            }
        });

        this.setState({sections: sections});
    }

    afterAddOfSections = (sections: ISection[]) => {
        var allSections = [
            ...this.state.sections,
        ];

        allSections.push(...sections);
        this.setState({showSectionForm: false, sections: allSections, showSections: true});
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
      this.setState({showSectionForm: false});
    }

    toggleCollapse = (target: any) => {

      if(this.state.showSections) {
          this.setState({showSections: false});
          return
      }

      if (target.tagName == 'DIV' || (target.tagName == 'INPUT' && !this.state.editFloor))
      {
            this.setState({loader: true, showSections: true, showSectionForm:false});

            Section.sections(this.props.floor.id.toString())
            .then((res) => {
                this.setState({sections: res})
            }).catch((err: any) => this.setState({message: "swr", messageClass: "text-danger"}))
            .finally(() => {
                this.setState({ loader:false });
                this.props.selectFloor(this.props.floor);
            });
      }
    }

    componentDidUpdate(prevState: any) {
    //   if(prevState.rooms.loader == true && this.props.rooms.loader == false)
    //   {
    //     const toggleSections = this.props.rooms.rooms.map((room) => {return {id: parseInt(room.id), open:false} });
    //     this.setState({toggleSections: toggleSections})
    //   }
    }

    toggleSectionsList = (open?: boolean) => {
    //   !this.props.toggleFloor?.open ? this.props.fetchRooms(this.props.floor) : "";
      this.setState({showSectionForm:false, showSections: open == undefined ? true : open});
      this.props.selectFloor(this.props.floor);
    }

    deleteSection = (section: ISection) => {
        this.setState( {sections: this.state.sections.filter((section_) => section.id != section_.id)} );
    }


    componentDidMount() {
     //this.props.fetchRooms(this.props.floor);

      // FloorRooms.getFloorRooms(this.props.floor)
      // .then((res) => this.setState({rooms: res}))
      // .catch((errors) => console.log(errors));
    }

    render() {
      const t = this.props.t;
      let sectionsList = this.state.sections.length > 0 ? this.state.sections.map((section, index) => {
        return(
          <SectionListItem
            section={section as ISection}
            key={index}
            deleteSection={this.deleteSection}
          />
        )
        }) : <h4 className="ml-5 mb-2">{t('No sections available')}</h4>;

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
                                  showSectionForm: !this.state.showSectionForm,
                                  showSections: false
                                });
                                this.props.selectFloor(this.props.floor, false);
                            }}
                           >
                             <span><i className={`fa ${this.state.showSectionForm ? 'fa-minus' : 'fa-plus'} room-form-icon mr-2`} aria-hidden="true"></i></span>{t('Sections')}
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
                          aria-expanded={this.state.showSections}
                        >
                          <i style={{cursor:'pointer'}} className={`fa ${this.state.showSections ? 'fa-angle-down' : 'fa-angle-up' } font-weight-bold ml-2`}></i>
                         </div>
                 </div>

               </div>
               {
                 this.state.message ? <span className={this.state.messageClass}>{this.state.message}</span> : ""
               }
                <Collapse
                    // in={this.props.toggleFloor?.open && this.state.showSections}
                    in={this.state.showSections}
                >
                  <div className=" collapse" id={`collapse${this.props.floor.id}`}>
                  {
                    this.state.loader ? <LoaderBar/> : sectionsList
                  }
                  </div>
                </Collapse>
            </div>
          }
           { this.state.showSectionForm == true ? <SectionForm
                                                        afterAddOfSections={this.afterAddOfSections}
                                                        toggleSectionsList={this.toggleSectionsList}
                                                        floor={this.state.floor}
                                                    /> : "" }
          </Fragment>
        );
    }
}

export default (withTranslation()(FloorListItem));
