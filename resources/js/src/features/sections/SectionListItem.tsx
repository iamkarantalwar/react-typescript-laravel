import React, { Fragment, PureComponent } from 'react';
import { Collapse } from 'react-bootstrap';
import { UserRoles } from '../../app/models/role.model';
import { ISection } from '../../app/models/section.model';
import { userObject } from '../../context/UserContext';
import Floor from '../floor/Floor';

interface IProps {
    section: ISection

}

interface IState {
    section: ISection,
    editSection: boolean,
    showFloors: boolean,
}

class SectionListItem extends PureComponent<IProps, IState> {
    constructor(props:IProps) {
        super(props);
        this.state = {
            section: {
               ...this.props.section
            },
            editSection: false,
            showFloors: false,
        }
    }

    updateSection(){


    }

    render() {
        return (
            <Fragment>
                    <div id=""  className="floor-card" style={{padding: '0 2rem !important', cursor: 'pointer'}}
                        // onClick={(e) => this.showTaps(e.target)}
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
                                                />
                                            </a>
                                        </div>
                                        <div className="room-edit-btn ">
                                            {
                                                //  userObject.role == UserRoles.ADMIN ?
                                                //  <a href={void(0)} className="text-dark" onClick={(e) => !this.state.editSection ? this.setState({editSection: true}) : this.updateRoomHandler(e) }>
                                                //      <i className={`fa ${!this.state.editSection ? 'fa-pencil' : 'fa-check' }`} aria-hidden="true"></i>
                                                //  </a> : ""
                                                userObject.role == UserRoles.ADMIN ?
                                                <a href={void(0)} className="text-dark" onClick={(e) => !this.state.editSection ? this.setState({editSection: true}) : this.updateSection() }>
                                                    <i className={`fa ${!this.state.editSection ? 'fa-pencil' : 'fa-check' }`} aria-hidden="true"></i>
                                                </a> : ""
                                            }
                                                <i
                                                    className={`fa ${this.state.showFloors ? 'fa-angle-down' : 'fa-angle-up' }
                                                     font-weight-bold ml-2`}
                                                    // aria-controls={`collapse${this.props.room.id}`}
                                                    // aria-expanded={this.state.showTaps}
                                                    // onClick={(e) => this.setState({showTaps: !this.state.showTaps})}
                                                ></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Collapse in={this.state.showFloors}>
                        <div className=" collapse" id={`collapse${this.props.section.project_floor_id}`}>
                            <Fragment>
                            {
                                this.state.showFloors ?
                                 <Floor/>: <></>
                            }
                            </Fragment>
                        </div>
                    </Collapse>
            </Fragment>
        );
    }
}

export default SectionListItem;
