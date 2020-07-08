import React, { Component, Fragment } from 'react';
import FloorForm from './FloorForm';
import { IProject } from '../../app/models/project.model';
import { IProjectFloor } from '../../app/models/project-floor.model';
import FloorListItem from './FloorListItem';
import { ITeam } from '../../app/models/team.model';
import { Team, ProjectFloors, User } from '../../app/api/agent';
import RoomForm from '../room/RoomForm';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';
import LoaderBar from '../../app/common/LoaderBar';
import { TitleContext, titleContextType } from '../../context/TitleContext';
import { connect } from 'react-redux';
import { RootState,changeTitle } from '../../redux';

const mapStateToProps = (state: RootState) => ({
    title: state.title,
});

const mapDispatchToProps = { changeTitle };

type ReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface IProps extends ReduxProps {
    project: IProject;
    reloadWindow: () => void;
}

interface IState {
    floors: IProjectFloor[];
    teams: ITeam[];
    showRoomForm: boolean;
    selectedFloor: IProjectFloor | null;
    loader: boolean;
}

class Floor extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state ={
            floors: [],
            teams: [],
            showRoomForm: true,
            selectedFloor: null,
            loader: false,
        }
        const context: titleContextType = this.context;
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
        this.props.changeTitle(this.props.project.project_name);
       
        this.setState({loader: true})
        User.fetchUser().then(res => console.log(res));
        ProjectFloors
        .getProjectFloors(this.props.project)
        .then((res) => this.setState({floors: res, loader: false}))
        .catch((error) => console.log(error));

        Team
        .getTeams()
        .then((teams) => this.setState({teams: teams}))
        .catch((error) => console.log(error));
    }

    componentWillUnmount() {
        this.props.changeTitle(null);
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
        const floorListItems: any = this.state.floors.map((floor) => {
            return <FloorListItem 
                        deleteFloor={this.deleteFloor}
                        selectFloor={this.selectFloor}
                        key={floor.id} 
                        floor={floor}
                        teams={this.state.teams}
                        afterUpdateFloor={this.afterUpdateFloor}
                    />
        });

        return (
            <Fragment>
                {
                    userObject.role == UserRoles.ADMIN ?
                    <FloorForm 
                        project={this.props.project} 
                        reloadWindow={this.props.reloadWindow}
                        afterAddOfFloors={this.afterAddOfFloors}
                    />  : ""
                }
                {  
                    this.state.loader ? 
                    <LoaderBar/> : 
                    this.state.floors.length == 0 ? <h1>No Floor Assigned Yet.</h1> : floorListItems           
                    
                }
                { this.state.showRoomForm && this.state.selectedFloor != null ? <RoomForm deselectFloor={this.deselectFloor} floor={this.state.selectedFloor}/> : "" }
            </Fragment> 
        );
    }
}

Floor.contextType = TitleContext;

export default connect(mapStateToProps, mapDispatchToProps)(Floor);
