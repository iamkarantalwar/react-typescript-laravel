import React, { Component, Fragment } from 'react';
import { IProject } from '../../app/models/project.model';

interface IProps {
    project: IProject
}

interface IState {}

class ProjectInfo extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        
    }
    
    render() {
        const {project} = this.props;
        return (
            <Fragment>
                <div className='row'>
                    <div className='col-md-3'>
                        <b>Project Name:</b>
                    </div>
                    <div className='col-md-9'>
                        {project.project_name}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-3'>
                        <b>Project Name:</b>
                    </div>
                    <div className='col-md-9'>
                        {project.description}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default ProjectInfo;
