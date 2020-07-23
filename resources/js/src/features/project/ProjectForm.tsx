import React, { Component, Fragment } from 'react';
import { IProject } from '../../app/models/project.model';
import { Project } from '../../../src/app/api/agent';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { RootState, editProjectForm, changeTitle } from '../../redux';
import { connect } from 'react-redux';
import { userObject } from '../../context/UserContext';
import { UserRoles } from '../../app/models/role.model';

const mapStateToProps = (state: RootState) => ({
    projectForm: state.project,
    title: state.title.title
});

interface IMapDispatchToProps {
    editProjectForm: (form: IProject, status?: boolean) => void,
    changeTitle: (title: string | null) => void,
}
  
const mapDispatchToProps: IMapDispatchToProps = { editProjectForm, changeTitle };

type ReduxProps = ReturnType<typeof mapStateToProps> & IMapDispatchToProps;

interface IProps extends ReduxProps, RouteComponentProps {
    project?: IProject;
    project_name?: string;
    toggleFloorForm?: () => void;
} 

// let projectObject :IProject = {project_name:string, description:string};

interface IState {
    btnText: string;
    errors: {
        project_name: string;
        description: string;
    },
    project_saved_message: string,
    showDescription: boolean,
}

export class ProjectForm extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state= this.defaultState;
    }

    defaultState = {
        btnText: "Projekt hinzufügen",
        errors: {
            project_name: "",
            description: "",
        },
        project_saved_message: "",
        showDescription: false,
    }

    componentDidMount() {
        let path = this.props.location.pathname.split('/');
        if(path[path.length-1] == "create") {
            this.setState({btnText: "Projekt erstellen", showDescription: true});
            const title = this.props.projectForm.project.project_name ? this.props.projectForm.project.project_name: this.props.title;
            this.props.changeTitle(title);
        }
        if(this.props.project)
        {
            this.props.editProjectForm(this.props.project as IProject);
            this.setState({showDescription: true});
        }        
    }

    onChangeHandler = (event: any) => {
        if(event.target.name == "project_name")
            this.props.editProjectForm({...this.props.projectForm.project, project_name: event.target.value});
        else
            this.props.editProjectForm({...this.props.projectForm.project, description: event.target.value});
    }

    componentDidUpdate(prevProps: IProps) {
        if(prevProps.project?.id == undefined && this.props.project?.id) {
            this.props.editProjectForm(this.props.project);
            this.setState({showDescription: true});
        }
    }

    componentWillUnmount() {
        let path = this.props.location.pathname.split('/');
        if(path[path.length-1] != "projects") {
            this.props.editProjectForm({project_name: "", description: ""});
        }
        this.props.changeTitle(null);
    }

    onSubmitHandler = (event: any) => {
        event.preventDefault();
        if(this.props.projectForm.active  && this.state.showDescription) {
            Project
            .saveProject(this.props.projectForm.project)
            .then((res) => {
                // this.props.afterAddNewProject(res);
                this.setState({
                    project_saved_message: "Projekt erfolgreich erstellt.",
                    errors:{
                        ...this.state.errors,
                        project_name: "",
                        description: "",
                    },
                    btnText: "Projekt hinzufügen"
                });

                this.props.editProjectForm({project_name: "", description: ""}, false);

                setTimeout(()=>{ 
                    this.setState({project_saved_message: ""});
                    this.props.history.push(`/project/${res.id}`);
                },
                2000);
            })
            .catch((error: AxiosError) => {
                if (error.response?.status == 422) {
                    let error_array = error.response?.data.errors;
                    this.setState({
                        errors: {...this.state.errors,
                                   project_name: error_array?.project_name != undefined ? error_array?.project_name[0] : "",
                                   description:  error_array?.description  != undefined ? error_array?.description[0]  : "",
                                }
                        });
                        setTimeout(()=>{ this.setState({project_saved_message: ""})},2000);
                }
            });
        } 
    }

    addFloor = () => {
        let path = this.props.location.pathname.split('/');
        if(path[path.length-2] == "project" && !isNaN(Number(path[path.length-1]))) {
            this.props.toggleFloorForm ? this.props.toggleFloorForm(): "";
        } else {
            this.props.history.push(`/project/${this.props.project?.id}`);
        }        
    }

    isFloorWindow = (): boolean => {
        let path = this.props.location.pathname.split('/');
        if(path[path.length-2] == "project" && !isNaN(Number(path[path.length-1]))) {
            return true;
        } else {
            return false;
        }
    }

    isSettingsWindow = (): boolean => {
        let path = this.props.location.pathname.split('/');
        if(path[path.length-3] == "project" && !isNaN(Number(path[path.length-2])) && path[path.length-1] == "settings") {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return(
        <div className="start-form container">
            <form onSubmit={this.onSubmitHandler.bind(this)}>
                <div className="col-md-12 mt-4">
                    <div className="row align-items-center">
                        <div className="col-md-9 col-lg-9 col-xl-10">
                            <div className="form-group">
                                <label className={`${this.isFloorWindow() ? 'font-weight-bold' : ''}`}>Projektname</label>
                                {
                                    this.isFloorWindow() ? <> <br/> {this.props.projectForm.project.project_name} </>
                                    :                                
                                    <input type="name" 
                                        className={`form-control ${this.state.errors.project_name ? 'is-invalid' : ''} ${this.state.project_saved_message ? 'is-valid' : ''}` } 
                                        placeholder="Projektname" 
                                        id="first-name"
                                        name="project_name"
                                        value={this.props.projectForm.project.project_name}
                                        onChange={this.onChangeHandler}
                                    />
                                }
                                { this.state.errors.project_name ? <span className="text-danger">{this.state.errors.project_name}</span> : "" }
                                { this.state.project_saved_message ? <span className="text-success">{this.state.project_saved_message}</span> : "" }
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 col-xl-2">
                                {(() => {
                                    if(!this.props.project)
                                    {
                                        return (
                                            <Fragment>
                                                  <div className="form-btn text-right mt-3">
                                                        <button 
                                                                type={this.state.showDescription ? 'submit' : 'button'} 
                                                                className="main-btn"
                                                                style={{width: '156px'}} 
                                                                onClick={(e) => 
                                                                {
                                                                    this.state.btnText != "Projekt erstellen" ? this.props.history.push('/project/create'): this.onSubmitHandler(e);
                                                                }}>
                                                            {this.state.btnText}
                                                        </button>
                                                </div>
                                            </Fragment>
                                        );
                                    }
                                })()}
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-md-9 col-lg-9 col-xl-10">
                        <div className={`form-group ${this.state.showDescription ? 'd-block' : 'd-none'}`}>
                            <label className={`${this.isFloorWindow() ? 'font-weight-bold' : ''}`}>Projektbeschreibung</label>
                            {
                                 this.isFloorWindow() ? <> <br/> {this.props.projectForm.project.description} </>
                                 :
                                <textarea className={`form-control ${this.state.errors.description ? 'is-invalid' : ''}`}
                                    placeholder="Hire sollte ein Text zur.." 
                                    id="exampleFormControlTextarea1" 
                                    rows={3}
                                    name="description"
                                    value={this.props.projectForm.project.description}
                                    onChange={this.onChangeHandler}
                                >
                                </textarea>
                            }
                           
                            { this.state.errors.description ? <span className="text-danger">{this.state.errors.description}</span> : "" }
                        </div>
                    </div>
                    </div>
                                          
                </div>
                <div className="col-md-12 my-2">
                    <div className="row align-items-center">
                        {
                            this.isSettingsWindow() ?
                            <div className="col-md-2 col-lg-2 col-xl-2">
                                <div className="form-btn text-right">
                                    <Link to={`/project/${this.props.project?.id}`} className="main-btn" style={{width: '145px'}}>Bodeneinstellungen</Link>
                                </div>             
                            </div> : ""   
                        }  
                        <div className="col-md-6 col-lg-6 col-xl-6">
                        {
                            userObject.role == UserRoles.ADMIN && this.props.project && !this.isSettingsWindow() ?
                                <div className="form-btn text-right">
                                    <Link to={`/project/${this.props.project?.id}/settings`} className="main-btn">Einstellung</Link>
                                </div>
                            : ""
                        }
                        </div>
                        <div className="col-md-2 col-lg-2 col-xl-2">
                            {
                                this.isFloorWindow() 
                                    ? 
                                <div className="form-btn text-right">
                                    <a href={void(0)} onClick={this.addFloor} className="main-btn" style={{width: '137px'}}>Böden hinzufügen</a>
                                </div> : ""
                            }
                           
                        </div>
                    </div>
                </div>
            </form>
            <hr/>
        </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectForm));
