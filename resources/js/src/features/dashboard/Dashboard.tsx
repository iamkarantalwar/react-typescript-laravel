import React, { Component, Fragment } from 'react';
import './progress-bar.scss';
import { IUser } from '../../app/models/user.model';
import { User, ProjectFloors, FloorRooms, Project } from '../../app/api/agent';
import { IFloorRoom } from '../../app/models/floor-room.model';
import { IProjectFloor, ProjectFloorStatus } from '../../app/models/project-floor.model';
import { IProject } from '../../app/models/project.model';
import LoaderBar from '../../app/common/LoaderBar';
import QueryString from 'query-string';
import { Router } from 'react-router';
import { Link } from 'react-router-dom';
import DashboardListItem from './DashboardListItem';

interface IProps { }

interface IState {
    users: IUser[],
    userLoader: boolean,
    rooms: IFloorRoom[],
    roomLoader: boolean,
    floors: IProjectFloor[],
    floorLoader: boolean,
    projects: IProject[],
    selectedProject?: IProject,
    floorsDone?: number,
    nextProjectIndex?: number,
    prevProjectIndex?: number,
    searchInput: string,
    filteredRooms: IFloorRoom[],
}

export class Dashboard extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state ={
            floors: [],
            projects: [],
            users:[],
            rooms:[],
            filteredRooms: [],
            userLoader: false,
            roomLoader: false,
            floorLoader: false,
            searchInput: "",
        }
    }


    componentDidMount() {
        this.fetchProjectDashboard();
    }

    componentDidUpdate(props: any, state: any) {
        const projectId = QueryString.parse(window.location.search).project_id as string;
        const prevProjectId = QueryString.parse(props.location.search).project_id as string;
        if(projectId) {
            const prevProjectId = QueryString.parse(props.location.search).project_id as string;
            if(prevProjectId != projectId)
            {
                this.fetchProjectDashboard(projectId);
            }
        }
    }

    fetchProjectDashboard = async (urlProjectId?: string) => {
        this.setState( {roomLoader: true, floorLoader: true} );
        let projectId: string | undefined;
        if(QueryString.parse(window.location.search).project_id) {
            if(urlProjectId) {
                projectId = urlProjectId as string;
            } else {
                projectId = QueryString.parse(window.location.search).project_id as string;
            }
        }

         // Fetching all required APIS
         Project.getProjects()
         .then((projects) => {
             let project: IProject;
             let nextProjectIndex: number | undefined;
             let prevProjectIndex: number | undefined;
            // If project id is present
             if(projectId) {
                const findProjectIndex =projects.findIndex((project) => project.id?.toString() == projectId);
                const findedProject = projects[findProjectIndex];
                if(findedProject) {
                    project = findedProject;
                    nextProjectIndex = projects[findProjectIndex+1]?.id;
                    prevProjectIndex = projects[findProjectIndex-1]?.id;
                } else {
                    project = projects[0];
                    projectId = (projects[0]?.id)?.toString();
                    nextProjectIndex = projects[0+1]?.id;
                }
             } else {
                project = projects[0];
                projectId = (projects[0]?.id)?.toString();
                nextProjectIndex = projects[0+1]?.id;
             }

             this.setState({
                 selectedProject: project,
                 nextProjectIndex: nextProjectIndex,
                 prevProjectIndex: prevProjectIndex
                });

            let proId =  projectId as string;
            ProjectFloors.getProjectFloors(proId)
                .then((floors) => { this.setState({ floors: floors}); })
                .catch((err) => { console.log(err)})
                .finally(() => this.setState({ floorLoader: false }) );
         })
         .catch((err) => {})
         .finally(() => this.setState({ userLoader: false }) );

        User.getUsers()
            .then((users) => { this.setState({users: users}); })
            .catch((err) => {})
            .finally(() => this.setState({ userLoader: false }) );


        FloorRooms.getAllRooms()
                    .then((rooms) => this.setState({ rooms: rooms, filteredRooms: rooms }))
                    .catch((err) => {})
            .finally(() => this.setState({ roomLoader: false }) );
    }

    updateListItem = (updatedFloor: IProjectFloor, updatedRoom: IFloorRoom) => {
        this.setState({
            floors : this.state.floors.map((floor) => floor.id == updatedFloor.id ? updatedFloor : floor),
            rooms : this.state.rooms.map((room) => room.id == updatedRoom.id ? updatedRoom : room),
        });
        this.filterListItems();
        alert('Room updated successfully.')
    }

    deleteListItem = (deletedRoom: IFloorRoom) => {
        this.setState({
            rooms : this.state.rooms.filter((room) => room.id != deletedRoom.id),
        });
        this.filterListItems();
    }

    filterListItems = () => {
        let search = this.state.searchInput;
        if (search != "") {
            let elem = this.state.rooms.filter(e => e.room_name.toLowerCase().includes(search.toLowerCase()));
            this.setState({filteredRooms: elem});
        } else {
            this.setState({filteredRooms: this.state.rooms});
        }

    }

    render() {
        const { floors, floorLoader, rooms } = this.state;
        const floorsDone = floors.filter((floor) => floor.status == ProjectFloorStatus.FINISHED).length;
        const floorProgressPercent  = floors.length != 0 ? (floorsDone/floors.length)*100 : 0;
        // const rooms = floors.map((floor) => )
        return (
        <Fragment>
            <section className="test-project mt-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="test-proj-tittel">
                                <h3 className="font-weight-normal">Current Projekt: {this.state?.selectedProject ? this.state.selectedProject.project_name : <LoaderBar/>} </h3>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="test-proj-btn text-right">
                                {
                                    this.state.prevProjectIndex ?
                                    <Link to={`/?project_id=${this.state.prevProjectIndex}`}>
                                        <button type="button" className="main-btn">Previous</button>
                                    </Link> : null
                                }
                                {
                                    this.state.nextProjectIndex ?
                                    <Link to={`/?project_id=${this.state.nextProjectIndex}`}>
                                        <button type="button" className="main-btn">Next</button>
                                    </Link> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="dashbord-overviwe mt-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <h5>Floor overview:</h5>
                            <div className="overviwe-progress-main">
                                <div className="overviwe-progress d-flex align-items-center py-4">
                                    <div className="progress" data-percentage={parseInt(floorProgressPercent.toString())}>
                                        <span className="progress-left">
                                            <span className="progress-bar"></span>
                                        </span>
                                        <span className="progress-right">
                                            <span className="progress-bar"></span>
                                        </span>
                                        <div className="progress-value">
                                            <div>
                                            {floorProgressPercent}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overviwe-progress-text ml-4">
                                        <h5>Floors overall
                                            <span className="text-danger">
                                                {floorLoader ? <LoaderBar/> : floors.length}
                                            </span>
                                        </h5>
                                        <h5>Floors done <span className="text-danger">{floorLoader ? <LoaderBar/> : floorsDone}</span></h5>
                                    </div>
                                </div>
                            </div>
                            <div className="overviwe-progress-main">
                                <h5>Room Overview:</h5>
                                <div className="overviwe-progress d-flex align-items-center pt-4">
                                    <div className="progress" data-percentage="74">
                                        <span className="progress-left">
                                            <span className="progress-bar"></span>
                                        </span>
                                        <span className="progress-right">
                                            <span className="progress-bar"></span>
                                        </span>
                                        <div className="progress-value">
                                            <div>
                                                74%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overviwe-progress-text ml-4">
                                        <h5>Floor overall
                                            <span className="text-danger">
                                                {floorLoader ? <LoaderBar/> : floors.length}
                                            </span>
                                        </h5>
                                        <h5>Rooms done <span className="text-danger">20</span></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 mt-3">
                            <div className="current-pro-form">
                                <form>
                                    <div className="main-overviwe-from d-flex justify-content-between">
                                        <div className="overview-search form-group">
                                            <input
                                                className="overviwe-form"
                                                type="search" placeholder="Search..."
                                                aria-label="Search"
                                                onChange={(e) => this.setState( {searchInput: e.target.value} )}
                                            />
                                        </div>
                                        <div className="form-group d-flex align-items-center">
                                            <label className="mr-2">All</label>
                                            <select name="all" className="form-control bg-white">
                                                <option value="volvo">Admin</option>
                                                <option value="saab">Admin</option>
                                                <option value="opel">Admin</option>
                                                <option value="audi">Admin</option>
                                            </select>
                                        </div>
                                        <div className="form-group d-flex align-items-center">
                                            <label className="mr-2">Type</label>
                                            <select name="all" className="form-control bg-white">
                                                <option value="volvo">Admin</option>
                                                <option value="saab">Admin</option>
                                                <option value="opel">Admin</option>
                                                <option value="audi">Admin</option>
                                            </select>
                                        </div>
                                        <div className="overview-search-btn">
                                            <button type="button" onClick={this.filterListItems} className="main-btn">Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="current-pro-dashbord">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                            <th scope="col">ROOM</th>
                                            <th scope="col" className="text-blue">FLOOR</th>
                                            <th scope="col">STATUS</th>
                                            <th scope="col">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                !this.state.floorLoader && !this.state.roomLoader ?
                                                this.state.floors.length > 0 ?
                                                    this.state.floors.map((floor) => {
                                                                return  this.state.filteredRooms.map((room) => {
                                                                        if(room.floor_id == floor.id.toString())
                                                                        {
                                                                            return (<DashboardListItem deleteListItem={this.deleteListItem} updateListItem={this.updateListItem} key={room.id} floor={floor} room={room}/>)
                                                                        }
                                                                })

                                                }) : <tr>
                                                        <td colSpan={4}>
                                                            <h1>No Rooms/Floors Available</h1>
                                                        </td>
                                                    </tr>

                                                : <LoaderBar/>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
        );
    }
}

export default Dashboard;
