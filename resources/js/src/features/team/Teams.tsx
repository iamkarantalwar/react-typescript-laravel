import React, { Component } from 'react';
import AddTeamForm from './AddTeamForm';
import TeamListItem from './TeamListItem';
import { ITeam } from '../../app/models/team.model';
import { Team } from '../../app/api/agent';
import LoaderBar from '../../app/common/LoaderBar';

interface IState {
    teamList: ITeam[];
    searchInput: string;
    elements: ITeam[];
    showLoader:boolean;
}

interface IProps {}

class Teams extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            teamList: [],
            searchInput:"",
            elements: [],
            showLoader:false,
        }
    }

    teamNameExist(team: ITeam): boolean{
        let team_ =  this.state.teamList.find((elem) => elem.team_name == team.team_name);
        if (team_) {
            return true;
        } else {
            return false;
        }
    }

    afterAddNewTeam = (team: ITeam) => {
        this.setState({
            elements:[...this.state.elements, team],
            teamList:[...this.state.teamList, team]
        })
    }
    

    componentDidMount() {
        this.setState({showLoader:true});
        Team
        .getTeams()
        .then((res) => {
            this.setState({teamList: res, elements:res});
            this.setState({showLoader:false});
        })
        .catch((res) =>{
            this.setState({showLoader:false});
            console.log(res)
        });
    }

    filterListItems = (event :any) => {
        let search = this.state.searchInput;
        if (search != "") {
            let elem = this.state.teamList.filter(e => e.team_name.toLowerCase().includes(search.toLowerCase()));
            this.setState({elements: elem});
        } else {
            this.setState({elements:this.state.teamList});
        }
       
    }

    render() {
        return (
            <div>
                <div className="start-form">
                    <div className="container">
                        <div className="main-team-area">
                            <AddTeamForm 
                                teamNameExist={this.teamNameExist.bind(this)} 
                                afterAddNewTeam={this.afterAddNewTeam.bind(this)}
                            />
                            <div className="team-search mt-5 px-4 ml-3">
                                <div className="row align-items-center justify-content-between ">
                                    <div className="add-new-team">
                                        <h5 className="font-weight-bold">Teams</h5>
                                    </div>
                                  
                                    <div className="team-form-btn">
                                        <form className="form-inline my-2 my-lg-0">
                                            <input className="form-control" 
                                                   type="search" 
                                                   placeholder="Search..." 
                                                   aria-label="Search"
                                                   onChange={(e) => this.setState({searchInput: e.target.value})}/>
                                            <button 
                                                className="btn s my-2 my-sm-0" 
                                                type="button"
                                                onClick={this.filterListItems.bind(this)}
                                            >
                                                <i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                            {
                                this.state.showLoader ? <LoaderBar/> : 
                                <div className="team-name-box">
                                    <h5 className="font-weight-normal ml-4">Teamname</h5>
                                    <div className="main-table table-responsive">
                                        <table className="table">
                                            
                                            <tbody>
                                                {
                                                this.state.elements                                           
                                                .map((team) => <TeamListItem 
                                                key={team.id} 
                                                team={team}                                                               
                                                />)}                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>       
            </div>
        );
    }
}

export default Teams;
