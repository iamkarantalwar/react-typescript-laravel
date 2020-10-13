import React, { Fragment, PureComponent } from 'react';
import { Collapse } from 'react-bootstrap';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { FloorRooms, Section } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { IProjectFloor } from '../../app/models/project-floor.model';
import { UserRoles } from '../../app/models/role.model';
import { ISection } from '../../app/models/section.model';
import { userObject } from '../../context/UserContext';
import { RootState ,fetchRooms} from '../../redux';
import Floor from '../floor/Floor';
import RoomForm from '../room/RoomForm';
import RoomListItem from '../room/RoomListItem';

const mapStateToProps = (state: RootState) => ({
    rooms: state.rooms,
  });

  interface IMapDispatchToProps {
    fetchRooms: (section: ISection) => void,
  }

  const mapDispatchToProps: IMapDispatchToProps = { fetchRooms };

  type ReduxProps = ReturnType<typeof mapStateToProps> & IMapDispatchToProps;


interface IProps extends WithTranslation, ReduxProps{
    section: ISection
    deleteSection: (section: ISection) => void,
}

interface IState {
    section: ISection,
    editSection: boolean,
    message: string,
    messageClass: string,
    loader: boolean,
    rooms: IFloorRoom[],
    roomLoader: boolean,
    showRoomsList: boolean,
    showRoomForm: boolean,
}

class SectionListItem extends PureComponent<IProps, IState> {
    constructor(props:IProps) {
        super(props);
        this.state = {
            section: {
               ...this.props.section
            },
            editSection: false,
            message: "",
            messageClass: "",
            loader: false,
            showRoomForm: false,
            showRoomsList: false,
            roomLoader: false,
            rooms: [],
        }
    }

    updateSection = () => {
        this.setState({ loader: true});
        Section.updateSection(this.state.section)
        .then((section: ISection) => {
            this.setState({
                section: {
                            ...section,
                },message: "Section updated successfully",
                messageClass: "text-success",
                editSection: false
            })
        })
        .catch((err) => this.setState({
                message: "swr",
                messageClass: "text-success"
        }))
        .finally(() =>  {
            this.setState({ loader: false})
            setTimeout(() => {
                this.setState({
                    message: "",
                    messageClass: ""
                });
            }, 2000);
        });
    }

    deleteSection() {
        const c = confirm(this.props.t("Are you sure you want to delete this section?"));
        if(c) {
           this.setState( {loader: true} );
           Section.deleteSection(this.props.section)
           .then((res) => this.props.deleteSection(this.props.section))
           .catch((err) => this.setState({messageClass: 'text-danger', message: 'swr'}))
           .finally(() => {
               this.setState({loader: false});
               setTimeout(() => {
                    this.setState({
                        message: "",
                        messageClass: ""
                    });
               }, 2000);
            });
        }
    }

    hideRoomForm = () => {
        this.setState({showRoomForm: false});
    }

    componentDidMount() {

    }

    toggleRoomsList = (open?: boolean) => {
        // !this.props.toggleFloor?.open ? this.props.fetchRooms(this.props.floor) : "";
        // !open ? this.props.fetchRooms(this.state.section.project_floor_id) : "";
        // this.setState({showRoomForm:false, showRooms: open == undefined ? true : open});
        // this.props.selectFloor(this.props.floor);
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

    toggleCollapse = (target: any) => {
        if(this.state.section.locked && target.tagName == 'DIV' || (target.tagName == 'INPUT' && !this.state.editSection)) {
            userObject.role != UserRoles.USER ? this.setState({
                                                        message: "This section is locked, click on the lock button to unlock",
                                                        messageClass: "text-warning"
                                                }) : this.setState({
                                                    message: "This section is locked, kindly contact admin or leader",
                                                    messageClass: "text-danger",
                                                });
            setTimeout(() => {
                this.setState({
                    message: "",
                    messageClass: ""
                })
            }, 2000);
            return;
        }
        if(this.state.showRoomsList == false) {
            if (target.tagName == 'DIV' || (target.tagName == 'INPUT' && !this.state.editSection))
            {
                this.setState( {roomLoader: true, showRoomForm:false, showRoomsList: true} );
                FloorRooms.getSectionRooms(this.props.section)
                .then((rooms) => {
                    this.setState({rooms: rooms});
                })
                .catch((err) => this.setState({
                    message: "swr",
                    messageClass: "text-danger"
                }))
                .finally(() => this.setState( {roomLoader: false} ));
            }
        } else {
            this.setState({ showRoomsList: false });
        }
      }

      unlockSection = (lock: boolean) => {
          this.setState( {loader: true} );
          Section.updateSection({
              ...this.state.section,
              locked: lock
          }).then((section) =>
            this.setState({
                message: "Section updated successfully",
                messageClass: "text-success",
                section: {
                    ...section
                }
            })
          )
          .catch((err) =>
            this.setState({
                message: "swr",
                messageClass: "text-danger"
            })
        ).finally(() => {
            this.setState({loader: false});
            setTimeout(() => {
                this.setState({
                    message: "",
                    messageClass: ""
                })
            }, 2000);
        });
      }

    render() {
        const t = this.props.t;
        let roomsList = this.state.rooms.length>0 ? this.state.rooms.map((room, index) => {
            return(
              <RoomListItem
                room={room as IFloorRoom}
                key={index}
                // toggleRoom={this.state.toggleRooms[index]}
                afterUpdateRoom={this.afterUpdateRoom}
              />
            )
          }) : <h4 className="ml-5 mb-2">Keine Zimmer verfügbar.</h4>;

        return (
            this.state.loader ? <LoaderBar/> :
            <Fragment>
                    <div id=""  className="floor-card" style={{padding: '0 2rem !important', cursor: 'pointer'}}
                        onClick={(e) => this.toggleCollapse(e.target)}
                    >
                        <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                            <div className="card mb-0 border-0">
                                <div className="card-header  mb-1" data-toggle="collapse" >
                                    <div className="main-room-overview d-flex justify-content-between">
                                        <div className="overview-floor-list">
                                            <a className="card-title">
                                                <input
                                                    type='text'
                                                    className={`form-control ${!this.state.editSection ? 'team-input cursor-pointer' : ''}`}
                                                    value={this.state.section.section_name}
                                                    readOnly={!this.state.editSection}
                                                    onChange={(e) => this.setState({section:{...this.state.section, section_name: e.target.value}})}
                                                    // onBlur={(e) => this.setState({editSection: false})}
                                                />
                                            </a>
                                        </div>
                                        <div className="room-btn">

                                        </div>
                                        <div className="room-edit-btn ">
                                            {
                                                userObject.role != UserRoles.ADMIN ? null :
                                                <a
                                                    href={void(0)}
                                                    className="overview-flor-btn bg-transparent"
                                                    onClick={(e) => {
                                                        this.setState({
                                                            showRoomForm: !this.state.showRoomForm,
                                                            showRoomsList: false
                                                        });
                                                    // this.props.selectFloor(this.props.floor, false);
                                                    }}
                                                >
                                                    <span><i className={`fa ${this.state.showRoomForm ? 'fa-minus' : 'fa-plus'} room-form-icon mr-2`} aria-hidden="true"></i></span>{t('Rooms')}
                                                </a>
                                            }
                                            {
                                                userObject.role != UserRoles.USER ? (this.state.section.locked ? <i className="fa fa-lock" onClick={(e) => this.unlockSection(false)}/> : <i className="fa fa-unlock" onClick={(e) => this.unlockSection(true)}/>) : null
                                            }
                                            {
                                                 userObject.role == UserRoles.ADMIN ?
                                                 <a href={void(0)} className="text-dark" onClick={(e) => this.deleteSection() }>
                                                     <i className={`fa fa-trash`} aria-hidden="true"></i>
                                                 </a> : ""
                                            }

                                            {
                                                userObject.role == UserRoles.ADMIN ?
                                                <a href={void(0)} className="text-dark" onClick={(e) => !this.state.editSection ? this.setState({editSection: true}) : this.updateSection() }>
                                                    <i className={`fa ${!this.state.editSection ? 'fa-pencil' : 'fa-check' }`} aria-hidden="true"></i>
                                                </a> : ""
                                            }
                                            {
                                                this.state.section.locked ? null :
                                                <i
                                                    className={`fa ${this.state.showRoomsList ? 'fa-angle-down' : 'fa-angle-up' }
                                                     font-weight-bold ml-2`}
                                                    // aria-controls={`collapse${this.props.room.id}`}
                                                    // aria-expanded={this.state.showTaps}
                                                    // onClick={(e) => this.setState({showTaps: !this.state.showTaps})}
                                                ></i>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.message ? <div className={`mb-3 ml-3 ${this.state.messageClass}`}>{t(this.state.message)}</div> : null }
                        </div>
                    </div>
                    <Collapse in={this.state.showRoomsList}>
                        <div className=" collapse" id={`collapse${this.props.section.project_floor_id}`}>
                            <Fragment>
                            {
                                this.state.showRoomsList ? this.state.roomLoader ? <LoaderBar/> : roomsList: null
                            }
                            </Fragment>
                        </div>
                    </Collapse>
                    { this.state.showRoomForm == true ? <RoomForm
                                                        afterRoomsAdded={this.toggleRoomsList}
                                                        section={this.props.section}
                                                        hideRoomForm={this.hideRoomForm}
                                                        key="room-form"
                                                    /> : "" }
            </Fragment>
        );
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SectionListItem));
