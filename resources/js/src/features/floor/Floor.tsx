import React, { Component, Fragment } from 'react';
import FloorForm from './FloorForm';
import { IProject } from '../../app/models/project.model';
import { IProjectFloor } from '../../app/models/project-floor.model';
import FloorListItem from './FloorListItem';
import { ITeam } from '../../app/models/team.model';
import { Team, ProjectFloors } from '../../app/api/agent';
import RoomForm from '../room/RoomForm';
import { IFloorRoom } from '../../app/models/floor-room.model';

interface IProps {
    project: IProject;
    reloadWindow: () => void;
}

interface IState {
    floors: IProjectFloor[];
    teams: ITeam[];
    showRoomForm: boolean;
    selectedFloor: IProjectFloor | null;
}

class Floor extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state ={
            floors: [],
            teams: [],
            showRoomForm: true,
            selectedFloor: null,
        }
    }

    afterAddOfFloors = (floors: IProjectFloor[]) => {
        let old_floors = this.state.floors;
        floors.forEach((floor, index) => {
            old_floors.push(floor);
        });
        this.setState({
            floors: old_floors,
        })
        console.log(this.state);
    }

    deleteFloor = (floor: IProjectFloor) =>{
       let floors = this.state.floors.filter((floor_)=> floor.id != floor_.id);
       this.setState({
           floors: floors,
       }) 
    }

    afterUpdateFloor = (floor: IProjectFloor) => {
        let floors: IProjectFloor[] = this.state.floors.map((item) => {
            if(item.id == floor.id)
            {
                return floor;
            }
            else {
                return item;
            }
        });
        console.log(floors);
        this.setState({floors:floors});
    }

    componentDidMount() {
        ProjectFloors
        .getProjectFloors(this.props.project)
        .then((res) => this.setState({floors: res}))
        .catch((error) => console.log(error));

        Team
        .getTeams()
        .then((teams) => this.setState({teams: teams}))
        .catch((error) => console.log(error));
    }

    selectFloor = (floor: IProjectFloor) => {
        this.setState({
            selectedFloor: floor
        });
    }

    deselectFloor = () => {
        this.setState({
            selectedFloor: null,
        })
    }

    afterAddOfRooms = (rooms : IFloorRoom) => {

    } 
    
    render() {
        return (
            <Fragment>
                <FloorForm 
                    project={this.props.project} 
                    reloadWindow={this.props.reloadWindow}
                    afterAddOfFloors={this.afterAddOfFloors}
                /> 
                {                 
                    this.state.floors.map((floor) => {
                        return <FloorListItem 
                                    deleteFloor={this.deleteFloor}
                                    selectFloor={this.selectFloor}
                                    key={floor.id} 
                                    floor={floor}
                                    teams={this.state.teams}
                                    afterUpdateFloor={this.afterUpdateFloor}/>
                    })
                }
                { this.state.showRoomForm && this.state.selectedFloor != null ? <RoomForm deselectFloor={this.deselectFloor} floor={this.state.selectedFloor}/> : "" }
            </Fragment> 
        );
    }
}

export default Floor;
