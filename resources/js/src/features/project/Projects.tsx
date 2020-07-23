import React, { Component, Fragment } from 'react';
import ProjectForm from './ProjectForm';
import {IProject} from '../../app/models/project.model';
import {Project, User} from '../../app/api/agent';
import ProjectListItem from './ProjectListItem';
import LoaderBar from '../../app/common/LoaderBar';
import { FormType } from '../../app/common/FormType';
import Floor from '../floor/Floor';
import { useLocation} from 'react-router-dom';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';
import { connect } from 'react-redux';

enum ProjectWindow {
    ADDFLOOR,
    CREATEPROJECT,
    PROJECTSETTINGS,
    VIEWPROJECTS
}

interface State {
    projects: IProject[];
    showFloor: boolean;
    showDescription: boolean;
    showLoader: boolean;
    formType: FormType;
    projectWindow: ProjectWindow;
    selectedProject: IProject | null;
}

interface Props {

}

export class Projects extends React.Component<Props, State> {
    
    defaultState : State = {
        projects: [],
        showDescription: false,
        showFloor: true,
        showLoader: false,
        formType: FormType.CREATE,
        projectWindow: ProjectWindow.VIEWPROJECTS,
        selectedProject: null,
    }

    state: State = this.defaultState;

    showAddFloorWindow = () => {
        this.setState({
            projectWindow: ProjectWindow.ADDFLOOR,
        });
    }

    showSettingsWindow = () => {
        this.setState({
            projectWindow: ProjectWindow.PROJECTSETTINGS
        });
    }

    reloadWindow = () => {
        this.setState(this.defaultState);
        this.componentDidMount();
    }

    afterAddNewProject = (project: IProject) => {
        this.setState({
            projects: [...this.state.projects, project]
        });
    }
    
    componentDidMount() {
        this.setState({showLoader: true});

        Project
        .getProjects()
        .then((res) => 
            this.setState({
                projects: res,
                showLoader: false,
            })
        );
    }

    afterDeleteProject = (project: IProject)=> {
      this.setState({
          projects: this.state.projects.filter((project_) => project.id != project_.id),
      });  
    } 

    render() {
        return (
            <div className="container">
                {
                    userObject.role == UserRoles.ADMIN ?
                    <ProjectForm project={undefined}/> : ""
                }
                {
                    (() => {
                        if(this.state.projectWindow == ProjectWindow.VIEWPROJECTS) {
                            return (
                                <Fragment>
                                    <div className={`floors-tabbs ${this.state.showFloor ? 'd-block' : 'd-none'}`}>
                                        <div className="col-md-12">
                                            <div id="accordion" className="accordion">
                                                <h4 className="floors-tittle font-weight-normal">Projekts</h4>
                                                {
                                                    this.state.showLoader ? 
                                                    <LoaderBar/> :
                                                    <div className="card mb-0 border-0">
                                                        { userObject.role == UserRoles.ADMIN ?
                                                            this.state.projects.map((project: IProject) => {
                                                                return(
                                                                    <ProjectListItem 
                                                                                key={project.id} 
                                                                                project={project}
                                                                                afterDeleteProject={this.afterDeleteProject}
                                                                    />
                                                                );
                                                            }) 
                                                            :
                                                            this.state.projects.map((project: IProject) => {
                                                                return project.floors != undefined && project.floors?.length > 0 ?
                                                                    <ProjectListItem 
                                                                                key={project.id} 
                                                                                project={project}
                                                                                afterDeleteProject={this.afterDeleteProject}
                                                                    />
                                                                 : "" 
                                                            })              
                                                       }                               
                                                    </div>
                                                }
                                            
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            );
                        }
                                       
                         else if(this.state.projectWindow == ProjectWindow.ADDFLOOR && userObject.role == UserRoles.ADMIN) {
                            return <Floor/>;
                        }

                    })()
                }
            </div>
        );
    }
}

export default connect(null)(Projects);
