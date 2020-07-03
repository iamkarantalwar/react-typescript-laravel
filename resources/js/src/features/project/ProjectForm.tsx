import React, { Component, Fragment } from 'react';
import { IProject } from '../../app/models/project.model';
import { Project } from '../../../src/app/api/agent';
import { AxiosError } from 'axios';
import { FormType } from '../../app/common/FormType';

interface IProps {
    showDescription: boolean;
    hideTabsAndShowDescription: () => void;
    hideDescriptionAndShowTabs: () => void;
    afterAddNewProject: (project: IProject) => void;
    formType: FormType;
    selectedProject: IProject | null;
    showAddFloorWindow: () =>void;
    showSettingsWindow: () =>void;
} 

// let projectObject :IProject = {project_name:string, description:string};

interface IState {
    btnText: string;
    project: IProject;
    errors: {
        project_name: string;
        description: string;
    },
    project_saved_message: string,
}

export class ProjectForm extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state= this.defaultState;
    }

    defaultState = {
        btnText: "Add Project",
        project:{
            project_name: "",
            description:"" 
        },
        errors: {
            project_name: "",
            description: "",
        },
        project_saved_message: "",
        
    }

    componentDidMount() {
        console.log('hello');
        // if(this.props.FormType == FormType.UPDATE) {
        //     this.setState({
        //         project: this.props.selectedProject
        //     });
        // }
    }

    componentDidUpdate(prevProps: IProps) {
        if(prevProps.formType == FormType.CREATE && this.props.formType == FormType.UPDATE && this.props.selectedProject != null) 
        {
            this.setState({
                project: this.props.selectedProject
            });
        } else if(prevProps.formType == FormType.UPDATE && this.props.formType == FormType.CREATE && this.props.selectedProject == null) {
            this.setState({
                project: this.defaultState.project
            });
        }
    }

    test = (event: any) =>{
        this.setState({
            // project.project_name : event.target.value
        }); 
    }

    

    onSubmitHandler = (event: any) => {
        event.preventDefault();

        if(this.props.showDescription) {

            Project
            .saveProject(this.state.project)
            .then((res) => {
                this.props.afterAddNewProject(res);
                this.setState({
                    project_saved_message: "Project saved Successfully.",
                    errors:{
                        ...this.state.errors,
                        project_name: "",
                        description: "",
                    },
                    project: {
                        ...this.state.project,
                        project_name: "",
                        description: "",
                    },
                    btnText: "Add Project"
                });
                this.props.hideDescriptionAndShowTabs();

                setTimeout(()=>{ this.setState({project_saved_message: ""})},2000);
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

    render() {
      
        // console.log(showDescription);
        return(
        <div className="start-form">
            <form onSubmit={this.onSubmitHandler.bind(this)}>
                <div className="col-md-12 mt-4">
                    <div className="row align-items-center">
                        <div className="col-md-9 col-lg-9 col-xl-10">
                            <div className="form-group">
                                <label>Projects Name</label>
                                <input type="name" className={`form-control ${this.state.errors.project_name ? 'is-invalid' : ''} ${this.state.project_saved_message ? 'is-valid' : ''}` } 
                                                   placeholder="Projects Name" 
                                                   id="first-name"
                                                   value={this.state.project.project_name}
                                                   onChange={(e)=>this.setState({project:{...this.state.project,project_name:e.target.value}})}/>
                                { this.state.errors.project_name ? <span className="text-danger">{this.state.errors.project_name}</span> : "" }
                                { this.state.project_saved_message ? <span className="text-success">{this.state.project_saved_message}</span> : "" }
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 col-xl-2">
                                {(() => {
                                    if(this.props.formType == FormType.UPDATE)
                                    {
                                        return (
                                            <Fragment>
                                                <div className="form-btn text-right" onClick={()=>this.props.showAddFloorWindow()}>
                                                    <a href={void(0)} className="main-btn">Add Floor</a>
                                                </div>
                                                <div className="form-btn text-right mt-4" onClick={()=> this.props.showSettingsWindow()}>
                                                    <a href={void(0)} className="main-btn">Settings</a>
                                                </div>
                                            </Fragment>
                                        );

                                    } else if(this.props.formType == FormType.CREATE) 
                                    {
                                        return (
                                            <Fragment>
                                                  <div className="form-btn text-right mt-3">
                                                    <button 
                                                            type='submit' 
                                                            className="main-btn" 
                                                            onClick={() => 
                                                            {
                                                                this.setState({btnText: "Create Project"});
                                                                this.props.hideTabsAndShowDescription();
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
                    <div className={`form-group ${this.props.showDescription ? 'd-block' : 'd-none'}`}>
                        <label>Example textarea</label>
                        <textarea className={`form-control ${this.state.errors.description ? 'is-invalid' : ''}`}
                                  placeholder="Hire sollte ein Text zur.." 
                                  id="exampleFormControlTextarea1" 
                                  rows={3}
                                  value={this.state.project.description}
                                  onChange={(e)=>{this.setState({project: {...this.state.project, description: e.target.value}})}}>
                        </textarea>
                        { this.state.errors.description ? <span className="text-danger">{this.state.errors.description}</span> : "" }
                    </div>
                </div>
            </form>
        </div>
        );
    }
}

export default ProjectForm;
