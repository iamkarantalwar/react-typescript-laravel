import React, { Component, Fragment } from 'react';
import FloorForm from './FloorForm';
import { IProject } from '../../app/models/project.model';
import { IProjectFloor } from '../../app/models/project-floor.model';
import FloorListItem from './FloorListItem';
import { ITeam } from '../../app/models/team.model';
import { Team } from '../../app/api/agent';

interface IProps {
    project: IProject;
    reloadWindow: () => void;
}

interface IState {
    floors: IProjectFloor[];
    teams: ITeam[];
}

class Floor extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state ={
            floors: this.props.project.floors as IProjectFloor[],
            teams: [],
        }
    }

    afterAddOfFloors = (floors: IProjectFloor[]) => {
        this.setState({
            floors: floors,
        })
        console.log(this.state);
    }

    componentDidMount() {
        Team
        .getTeams()
        .then((teams) => this.setState({teams: teams}))
        .catch((error) => console.log(error));
    }
    
    render() {
        return (
            this.state.floors.length === 0 ? <FloorForm 
                                                project={this.props.project} 
                                                reloadWindow={this.props.reloadWindow}
                                                afterAddOfFloors={this.afterAddOfFloors}/> 
                                        :  <Fragment>
                                            {
                                                this.state.floors.map((floor) => {
                                                    return <FloorListItem 
                                                                key={floor.id} 
                                                                floor={floor}
                                                                teams={this.state.teams}/>
                                                })
                                            }
                                            </Fragment> 
        );
    }
}

export default Floor;
