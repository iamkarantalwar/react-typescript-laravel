import React, { Component } from 'react';
import { ITeam } from '../../app/models/team.model';
import { Team } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';

interface IProps {
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
            this.setState({errors: {...this.state.errors, team_name: "This team name is already exist."}});
           
        } else {
            this.setState({showLoader: true});
            Team
            .saveTeam(this.state.team)
            .then((res) =>{ 
                this.setState({errors: {...this.state.errors, team_name: ""}});
                this.setState({success: "Team Created Successfully."});
                this.props.afterAddNewTeam(res);
                this.setState({team:{...this.state.team, team_name:""}});
                this.setState({showLoader: false});
            });
           
        }
        
    }
    
    render() {
        return (
            <div className="team-add-form px-4">
                    <form onSubmit={this.onSubmitHandler.bind(this)}>
                        {this.state.showLoader ? <LoaderBar/> : ""}
                        <div className="row align-items-center justify-content-between">
                            <div className="add-new-team">
                                <div className="form-group">
                                <label>Add New Team</label>
                                <input 
                                    type="text" 
                                    name="team_name" 
                                    onChange={(e) => this.setState({team: {...this.state.team, team_name: e.target.value}})}
                                    className={`form-control ${this.state.errors.team_name ? 'is-invalid': '' }`}
                                />
                                </div>
                            </div>
                            <div className="team-form-btn">
                                <div className="form-btn text-right mt-3">
                                    <button className="main-btn" type="submit">Add</button>
                                </div>
                            </div>
                        </div>
                        {this.state.errors.team_name ? <span className="text-danger">{this.state.errors.team_name}</span>: ""}
                        {this.state.success ? <p className="text-primary">{this.state.success}</p> : ""}
                    </form>
            </div>
        );
    }
}

export default AddTeamForm;
