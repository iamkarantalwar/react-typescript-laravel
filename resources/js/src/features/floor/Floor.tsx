import React, { Component, Fragment } from 'react';
import FloorForm from './FloorForm';
import { IProject } from '../../app/models/project.model';
import { IProjectFloor } from '../../app/models/project-floor.model';
import FloorListItem from './FloorListItem';
import { ITeam } from '../../app/models/team.model';
import { Team, ProjectFloors, User, Project } from '../../app/api/agent';
import { IFloorRoom } from '../../app/models/floor-room.model';
import LoaderBar from '../../app/common/LoaderBar';
import { TitleContext, titleContextType } from '../../context/TitleContext';
import { connect } from 'react-redux';
import { RootState, changeTitle, fetchProjectSettings, fetchUsers } from '../../redux';
import { RouteComponentProps, withRouter } from 'react-router';
import ProjectForm from '../project/ProjectForm';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';
import Pumpstart from '../pumpstart/Pumpstart';

interface MatchParams {
    id: string;
}

interface IMapDispatchToProps {
    changeTitle: (title: string | null) => {
        type: string;
        payload: string | null;
    };
    fetchProjectSettings: (projectId: string)  => void;
    fetchUsers: () => void
}

const mapStateToProps = (state: RootState) => ({
    title: state.title,
    projectSettings: state.projectSettings,
});

const mapDispatchToProps: IMapDispatchToProps = { changeTitle, fetchProjectSettings, fetchUsers };

type ReduxProps = ReturnType<typeof mapStateToProps> & IMapDispatchToProps;

interface IProps extends ReduxProps, RouteComponentProps<MatchParams> {
    project?: IProject;
}

interface IState {
    floors: IProjectFloor[];
    teams: ITeam[];
    showRoomForm: boolean;
    // selectedFloor: IProjectFloor | null;
    loader: boolean;
    project: IProject;
    showFloorForm: boolean;
    toggleFloors: Array<{id: number, open:boolean}>;
}

class Floor extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state ={
            floors: [],
            teams: [],
            showRoomForm: true,
            // selectedFloor: null,
            showFloorForm: false,
            loader: false,
            project: {
                description:"",
                project_name: "",
                floors: [],
            },
            toggleFloors: []
        }
        const context: titleContextType = this.context;
    }

    toggleForm = () => {
        this.setState({ showFloorForm: !this.state.showFloorForm });
    }

    afterAddOfFloors = (floors: IProjectFloor[]) => {
        let old_floors = this.state.floors;
        let toggleFloors = this.state.toggleFloors;
        floors.forEach((floor, index) => {
            old_floors.push(floor);
            toggleFloors.push({id: floor.id, open:false});
        });

        this.setState({
            floors: old_floors,
            toggleFloors: toggleFloors,
        })
    }

    deleteFloor = (floor: IProjectFloor) =>{
       let floors = this.state.floors.filter((floor_)=> floor.id != floor_.id);
       this.setState({
           floors: floors,
           toggleFloors: this.state.toggleFloors.filter((toggle) => toggle.id != floor.id),
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
        this.setState({floors:floors});
    }

    selectFloor = (floor: IProjectFloor, open: boolean | undefined = undefined) => {
        let toggleFloors = this.state.toggleFloors.map((floor_) => floor_.id == floor.id ? {id: floor_.id, open: open != undefined ? open : !floor_.open} : {id: floor_.id, open: false});
        this.setState({toggleFloors: toggleFloors});
    }

    componentDidMount() {

        this.setState({loader: true})

        Project
        .getProject(this.props.match.params.id)
        .then((res) => {
            this.setState({project:res});
            this.props.changeTitle(res.project_name);
        });

        ProjectFloors
        .getProjectFloors(this.props.match.params.id)
        .then((res) => {
            this.setState({floors: res, loader: false});
            const toggleFloors = res.map((floor) =>{ return {id: floor.id, open:false} });
            this.setState({toggleFloors: toggleFloors});
        })
        .catch((error) => console.log(error));

        Team
        .getTeams()
        .then((teams) => this.setState({teams: teams}))
        .catch((error) => console.log(error));


        //Fetch all the project settings Because they are common in every tab
        this.props.fetchProjectSettings(this.props.match.params.id);
        //Fetch all the users because they are common in evry tab
        this.props.fetchUsers();
    }

    componentWillUnmount() {
        this.props.changeTitle(null);
    }

    // selectFloor = (floor: IProjectFloor) => {
    //     this.setState({
    //         selectedFloor: floor
    //     });
    // }

    afterAddOfRooms = (rooms : IFloorRoom) => {

    }

    render() {

        const floorListItems: any = this.state.floors.map((floor, index) => {
            return <FloorListItem
                        deleteFloor={this.deleteFloor}
                        selectFloor={this.selectFloor}
                        toggleFloor={this.state.toggleFloors[index]}
                        key={floor.id}
                        floor={floor}
                        teams={this.state.teams}
                        afterUpdateFloor={this.afterUpdateFloor}
                    />
        });

        return (
            <div className="container">
                <Fragment>
                    {
                        userObject.role == UserRoles.ADMIN ?
                        <Fragment>
                            <ProjectForm toggleFloorForm={this.toggleForm} project={this.state.project}/>
                            {
                                this.state.showFloorForm ?
                                <FloorForm
                                    toggleForm = {this.toggleForm}
                                    project={this.state.project as IProject}
                                    afterAddOfFloors={this.afterAddOfFloors}
                                />  : ""
                            }
                        </Fragment>
                        : ""
                    }
                     { this.props.projectSettings.loader == false ? <Pumpstart projectSettings={this.props.projectSettings.projectSettings}/> : null }
                     {/* <img src={require('../../../../images/coming-soon.jpg')} width={'100%'}/> */}
                    {
                        this.state.loader ?
                        <LoaderBar/> :
                        this.state.floors.length == 0 ? <h3 className="ml-md-5">Kein Boden verfügbar.</h3> : floorListItems
                    }

                </Fragment>
            </div>
        );
    }
}

Floor.contextType = TitleContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Floor));
