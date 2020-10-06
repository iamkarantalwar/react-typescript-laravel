import React, { Component, Fragment } from 'react';
import { ITeam } from '../../app/models/team.model';
import { Team, RoomType } from '../../app/api/agent';
import { AxiosError } from 'axios';
import LoaderBar from '../../app/common/LoaderBar';
import { IRoomType } from '../../app/models/room-type.model';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ITap } from '../../app/models/tap.model';

interface IProps extends WithTranslation {
    roomType: IRoomType;
    deleteTapType: (tapType: IRoomType) => void,
}

interface IState {
    roomType: IRoomType;
    updateState: boolean;
    updated: boolean;
    errors: IRoomType;
    showLoader: boolean;
}

class TapTypeListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            roomType:{
               ...this.props.roomType
            },
            errors:{
                id: 1,
                room_type: "",
            },
            updated: false,
            updateState: false,
            showLoader: false,
        }
    }

    teamNameChangeHandler = (event: any) => {
        this.setState({roomType: {...this.state.roomType, room_type: event.target.value}});

        if (event.target.value != this.props.roomType.room_type) {
            this.setState({updateState: true});
        } else {
            this.setState({updateState: false});
        }
    }

    updateTapType() {
        if (this.state.updateState) {
            this.setState({showLoader: true});
            RoomType
            .updateRoomType(this.state.roomType)
            .then((res)=>
            {
                this.setState({updateState: false, updated:true, showLoader: false});
                this.setState({errors: {...this.state.errors, room_type: ""}});
                setTimeout(()=>{ this.setState({updated: false})},2000);
            })
            .catch((res: AxiosError) => {
                this.setState({showLoader: false});
                this.setState({errors: {...this.state.errors, room_type: "swr"}});
                setTimeout(()=>{ this.setState({errors: {...this.state.errors, room_type: ""}}) },2000);
            });
        } else {
            this.setState({
                updateState: true,
            })
        }
    }



    render() {
        const t = this.props.t;
        return (
            <Fragment>
                {this.state.showLoader ? <LoaderBar/> : ""}
                 <tr>
                    <th scope="row" className="text-left">
                        <input type="text"
                            value={this.state.roomType.room_type}
                            className={` ${this.state.updateState ?  'form-control' : 'team-input' }`}
                            onChange={this.teamNameChangeHandler.bind(this)}
                            onBlur={(e) => this.setState({ updateState: false })}
                        /><br/>
                        {this.state.errors.room_type ? <span className="text-danger">{t(this.state.errors.room_type)}</span> : ""}
                        {this.state.updated ? <span className="text-success">{t('Tap type updated successfully')}</span> : ""}
                    </th>
                    <td>
                        <i className={`fa-btn fa ${this.state.updateState ? `fa-check` : `fa-pencil`}`}
                            aria-hidden="true"
                            onClick={this.updateTapType.bind(this)}></i>
                        <i className={`fa-btn fa fa-trash ml-1`}
                            aria-hidden="true"
                            onClick={(e) => {
                                const c = confirm(t('Are you sure you want to delete this tap type?'));
                                if (c) {
                                    this.props.deleteTapType(this.state.roomType)
                                }
                            }}></i>
                    </td>
                 </tr>

            </Fragment>
        );
    }
}

export default withTranslation()(TapTypeListItem);
