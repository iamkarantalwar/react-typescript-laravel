import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ProjectForm} from './ProjectForm';
import {IProject} from '../../app/models/project.model';
import {Project} from '../../app/api/agent';
import FloorListItem from './FloorListItem';

interface State {
    projects: IProject[];
    showFloor: boolean,
    showDescription: boolean,
}

interface Props {

}

export class Projects extends React.Component<Props, State> {
    
    state: State= {
        projects: [],
        showDescription: false,
        showFloor: true
    }

    toggleDescriptionAndTabs() {
        if (this.state.showDescription) {
            this.setState({
                showFloor:true,
                showDescription: false,
            });
        } else {
            this.setState({
                showFloor: false,
                showDescription: true
            });
        }
    }
    
    componentDidMount() {
        Project.getProjects().then((res) => this.setState({
            projects: res
        }));
    }

    render() {
        return (
            <div className="container">
                <ProjectForm showDescription={this.state.showDescription} toggleDescriptionAndTabs={this.toggleDescriptionAndTabs.bind(this)}/>
                <div className={`floors-tabbs ${this.state.showFloor ? 'd-block' : 'd-none'}`}>
                    <div className="col-md-12">
                    <div id="accordion" className="accordion">
                        <h4 className="floors-tittle font-weight-normal">Floors</h4>
                        <div className="card mb-0 border-0">
                            {this.state.projects.map((project: IProject) => {
                                return(
                                    <FloorListItem key={project.id} project={project}/>
                                );                            
                            })}                               
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Projects;
