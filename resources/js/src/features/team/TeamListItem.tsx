import React, { Component, Fragment } from 'react';
import { ITeam } from '../../app/models/team.model';
import { Team } from '../../app/api/agent';
import { AxiosError } from 'axios';
import LoaderBar from '../../app/common/LoaderBar';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IProps extends WithTranslation {
    team: ITeam;
}

interface IState {
    team: ITeam;
    updateState: boolean;
    updated: boolean;
    errors: ITeam;
    showLoader: boolean;
}

class TeamListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            team:{
                id: this.props.team.id,
                team_name: this.props.team.team_name
            },
            errors:{
                team_name:"",
            },
            updated: false,
            updateState: false,
            showLoader: false,
        }
    }

    teamNameChangeHandler = (event: any) => {
        this.setState({team: {...this.state.team, team_name: event.target.value}});

        if (event.target.value != this.props.team.team_name) {
            this.setState({updateState: true});
        } else {
            this.setState({updateState: false});
        }
    }

    updateTeam() {
        if (this.state.updateState) {
            this.setState({showLoader: true});
            Team
            .updateTeam(this.state.team)
            .then((res)=>
            {
                this.setState({updateState: false, updated:true, showLoader: false});
                this.setState({errors: {...this.state.errors, team_name: ""}});
                setTimeout(()=>{ this.setState({updated: false})},2000);
            })
            .catch((res: AxiosError) => {
                console.log(res.response);
                console.log(res.request);
                if (res.response?.status == 422) {
                    if(res.response.data.errors['team_name'])
                    {
                        this.setState({errors: {...this.state.errors, team_name: res.response.data.errors['team_name']}});

                    }
                    this.setState({showLoader: false});
                }
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
                            value={this.state.team.team_name}
                            className={` ${this.state.updateState ?  'form-control' : 'team-input' }`}
                            onChange={this.teamNameChangeHandler.bind(this)}
                        /><br/>
                        {this.state.errors.team_name ? <span className="text-danger">{this.state.errors.team_name}</span> : ""}
                        {this.state.updated ? <span className="text-success">{t('Team name updated successfully')}</span> : ""}
                    </th>
                    <td>
                        <i className={`fa-btn fa ${this.state.updateState ? `fa-check` : `fa-pencil`}`}
                            aria-hidden="true"
                            onClick={this.updateTeam.bind(this)}></i>
                    </td>
                 </tr>

            </Fragment>
        );
    }
}

export default withTranslation()(TeamListItem);
