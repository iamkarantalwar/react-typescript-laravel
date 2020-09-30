import React, { Component } from 'react';
import { ITeam } from '../../app/models/team.model';
import { Team, RoomType } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { IRoomType } from '../../app/models/room-type.model';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IProps extends WithTranslation {
    tapTypeNameExist : (tapType: IRoomType) => boolean;
    afterAddNewTap: (tapType: IRoomType) => void;
}

interface IState{
    tapType: IRoomType;
    errors: IRoomType;
    success: string;
    showLoader: boolean;

}

class AddTapTypeForm extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            tapType:{
                room_type: "",
            },
            errors:{
                room_type: ""
            },
            success: "",
            showLoader: false,
        }
    }

    onSubmitHandler = (event: any) =>{
        event.preventDefault();

        let tapTypeName = this.state.tapType.room_type;
        //Check if Team Name Is Not Empty
        if (tapTypeName == "") {
            this.setState({errors: {...this.state.errors, room_type: 'Enter the tap type'}});

        } else if(this.props.tapTypeNameExist(this.state.tapType)) {
            this.setState({errors: {...this.state.errors, room_type: 'This tap type is already exist'}});

        } else {
            this.setState({showLoader: true});
            RoomType
            .saveRoomType(this.state.tapType)
            .then((res) =>{
                this.setState({errors: {...this.state.errors, room_type: ""}});
                this.setState({success: "Team erfolgreich erstellt."});
                this.props.afterAddNewTap(res);
                this.setState({tapType:{...this.state.tapType, room_type:""}});
                this.setState({showLoader: false});
                setTimeout(()=>{ this.setState({success: ""})},2000);
            })
            .catch((res) => {
                if (res.response?.status == 422) {
                    if(res.response.data.errors['team_name'])
                    {
                        this.setState({errors: {...this.state.errors, room_type: res.response.data.errors['room_type'][0]}});

                    }
                    this.setState({showLoader: false});
                } else {
                    this.setState({errors: {...this.state.errors, room_type: "swr"}})
                }
            });

        }

    }

    render() {
        const t = this.props.t;
        return (
            <div className="team-add-form px-4">
                    <form onSubmit={this.onSubmitHandler.bind(this)}>
                        {this.state.showLoader ? <LoaderBar/> : ""}
                        <div className="row align-items-center justify-content-between">
                            <div className="add-new-team">
                                <div className="form-group">
                                    <label>{t('Tap') + ' ' + t('Type')}</label>
                                <input
                                    type="text"
                                    name="team_name"
                                    value={this.state.tapType.room_type}
                                    onChange={(e) => this.setState({tapType: {...this.state.tapType, room_type: e.target.value}})}
                                    className={`form-control ${this.state.errors.room_type ? 'is-invalid': '' }`}
                                />
                                </div>
                            </div>
                            <div className="team-form-btn">
                                <div className="form-btn text-right mt-3">
                                    <button className="main-btn" type="submit">{t('Save')}</button>
                                </div>
                            </div>
                        </div>
                        {this.state.errors.room_type ? <span className="text-danger">{t(this.state.errors.room_type.toString())}</span>: ""}
                        {this.state.success ? <p className="text-primary">{this.state.success}</p> : ""}
                    </form>
            </div>
        );
    }
}

export default withTranslation()(AddTapTypeForm);
