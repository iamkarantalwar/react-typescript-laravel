import React, { Component, Fragment } from 'react';
import { IProject } from '../../app/models/project.model';
import { Collapse } from 'react-bootstrap';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';
import { Project } from '../../app/api/agent';
import { withTranslation, WithTranslation } from 'react-i18next';

interface State {
   open: boolean;
   message: string;
   messageClass: string;
}

interface IProps extends RouteComponentProps, WithTranslation {
    project?: IProject;
    afterDeleteProject: (project: IProject) => void;
}

class ProjectListItem extends Component<IProps, State> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            open: false,
            message: '',
            messageClass: '',
        }
    }

    deleteProject = () => {
       const conf = confirm(this.props.t("Are you sure you want to delete this project?"));
       if (conf) {
        Project
        .deleteProject(this.props.project as IProject)
        .then((res) => {
             this.setState({
                 message: "Project Deleted Successfully",
                 messageClass: "danger"
             });
             this.props.afterDeleteProject(this.props.project as IProject);
        })
        .catch((err) => {
             this.setState({
                 message: "swr",
                 messageClass: "danger"
             })
        })
       }
    }

    openProjectFloors = (target: any) => {
        if(target.tagName != 'I') {
            this.props.history.push(`/project/${this.props.project?.id}`)
        }
    }

    render() {
        const { project, t } = this.props;
        return (
            <div onClick={(e) => this.openProjectFloors(e.target)} style={{cursor: 'pointer'}}>
                <div className={`card-header collapsed mb-2 border border-${this.state.messageClass ? this.state.messageClass : 'default'}`}>
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
                        <Fragment>
                            <Link to={`project/${project?.id}/settings`}>
                                <span >
                                    <i className="fa fa-gear"></i>
                                </span>
                            </Link>
                                <span className='mr-3' onClick={this.deleteProject}>
                                    <i className="fa fa-trash"></i>
                                </span>

                        </Fragment>
                        : ""
                    }

                </div>
                <Collapse in={this.state.open}>
                    <div className="card-body collapse" id={`collapse${project?.id}`}>
                        <p>
                            {project?.description}
                        </p>
                    </div>
                </Collapse>
                { this.state.message ? <span className={`project-list-item-message text-${this.state.messageClass}`}>{t(this.state.message)}</span> : ""}
            </div>
        );
    }
}

export default withTranslation()(withRouter(ProjectListItem));
