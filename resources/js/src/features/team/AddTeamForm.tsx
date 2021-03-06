import React, { Component } from 'react';
import { ITeam } from '../../app/models/team.model';
import { Team } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';
import { WithTranslation, withTranslation} from 'react-i18next';

interface IProps extends WithTranslation {
    teamNameExist : (team: ITeam) => boolean;
    afterAddNewTeam: (team: ITeam) => void;
}

interface IState{
    team: ITeam;
    errors: ITeam;
    success: string;
    showLoader: boolean;

}

class AddTeamForm extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            team:{
                team_name: ""
            },
            errors:{
                team_name: ""
            },
            success: "",
            showLoader: false,
        }
    }

    onSubmitHandler = (event: any) =>{
        event.preventDefault();

        let team_name = this.state.team.team_name;
        //Check if Team Name Is Not Empty
        if (team_name == "") {
            this.setState({errors: {...this.state.errors, team_name: "Enter the team name"}});

        } else if(this.props.teamNameExist(this.state.team)) {
            this.setState({errors: {...this.state.errors, team_name: "This team name is already exist"}});

        } else {
            this.setState({showLoader: true});
            Team
            .saveTeam(this.state.team)
            .then((res) =>{
                this.setState({errors: {...this.state.errors, team_name: ""}});
                this.setState({success: "Team created successfully"});
                this.props.afterAddNewTeam(res);
                this.setState({team:{...this.state.team, team_name:""}});
                this.setState({showLoader: false});
                setTimeout(()=>{ this.setState({success: ""})},2000);
            })
            .catch((res) => {
                console.log(res.response);
                console.log(res.request);
                if (res.response?.status == 422) {
                    if(res.response.data.errors['team_name'])
                    {
                        this.setState({errors: {...this.state.errors, team_name: res.response.data.errors['team_name'][0]}});

                    }
                    this.setState({showLoader: false});
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
                                <label>Team Name</label>
                                <input
                                    type="text"
                                    name="team_name"
                                    value={this.state.team.team_name}
                                    onChange={(e) => this.setState({team: {...this.state.team, team_name: e.target.value}})}
                                    className={`form-control ${this.state.errors.team_name ? 'is-invalid': '' }`}
                                />
                                </div>
                            </div>
                            <div className="team-form-btn">
                                <div className="form-btn text-right mt-3">
                                    <button className="main-btn" type="submit">{t('Add')}</button>
                                </div>
                            </div>
                        </div>
                        {this.state.errors.team_name ? <span className="text-danger">{t(this.state.errors.team_name)}</span>: ""}
                        {this.state.success ? <p className="text-primary">{t(this.state.success)}</p> : ""}
                    </form>
            </div>
        );
    }
}

export default withTranslation()(AddTeamForm);
