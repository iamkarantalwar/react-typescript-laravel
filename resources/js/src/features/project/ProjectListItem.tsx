import React, { Component } from 'react';
import { IProject } from '../../app/models/project.model';
import { Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';

interface State {
   open: boolean;
}

interface IProps {
    project?: IProject;
}

class ProjectListItem extends Component<IProps, State> {
    constructor(props: IProps) {
        super(props);
        
        this.state = {
            open: false,
        }
    }
    
    render() {
        const { project } = this.props;
        return (
            <div>
                <div className="card-header collapsed mb-2">
                    <a 
                       className="card-title collapsed" 
                       href={void(0)}
                       onClick={()=>this.setState({open: !this.state.open})}
                       aria-controls={`collapse${project?.id}`}
                       aria-expanded={this.state.open}
                    >
                       {project?.project_name}
                    </a>
                    {
                        userObject.role == UserRoles.ADMIN ?
                        <Link to={`project/${project?.id}`}>
                            <span>
                                <i className="fa fa-gear"></i>
                            </span>
                        </Link> : 
                        <Link to={`project/${project?.id}/floors`}>
                            <span>
                                <i className="fa fa-gear"></i>
                            </span>
                        </Link>
                    }
                    
                </div>
                <Collapse in={this.state.open}>
                    <div className="card-body collapse" id={`collapse${project?.id}`}>
                        <p>
                            {project?.description}
                        </p>
                    </div>
                </Collapse>     
                
            </div>
        );
    }
}

export default ProjectListItem;
