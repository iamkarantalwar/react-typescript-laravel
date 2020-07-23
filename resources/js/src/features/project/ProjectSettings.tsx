import React, { Component, Fragment } from 'react';
import { IProject } from '../../app/models/project.model';
import { ProjectSetting, Project } from '../../app/api/agent';
import { IProjectSetting,  ProjectSettingStatus} from '../../app/models/project-setting.model';
import { AxiosError } from 'axios';
import LoaderBar from '../../app/common/LoaderBar';
import { connect } from 'react-redux';
import { RootState, changeTitle } from '../../redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ProjectForm from './ProjectForm';


interface MatchParams {
    id: string;
}

const mapStateToProps = (state: RootState) => ({
    title: state.title,
});

const mapDispatchToProps = { changeTitle };

type ReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface IProps extends ReduxProps, RouteComponentProps<MatchParams>{ }

interface IState {
    project?: IProject;
    settings: IProjectSetting[];
    errors: Array<{field_wirkzeit:string, field_spulzeit:string }>,
    showLoader: boolean,
    message: string,
    messageClass: string
}

class ProjectSettings extends Component<IProps, IState> {

    defaultErrors : Array<{field_wirkzeit:string, field_spulzeit:string }> = [];

    defaultState :IState = {
        settings: [],
        errors:[],
        showLoader: false,
        message: "",
        messageClass: "",
    }

    constructor(props: IProps) {
        super(props);
        this.state = this.defaultState;
    }

    componentDidMount() {

        this.setState({
            showLoader: true,
        })

        Project
        .getProject(this.props.match.params.id)
        .then((project) => { 
            this.setState({project: project});
            this.props.changeTitle(project.project_name);
        })

        ProjectSetting
        .getProjectSettings(this.props.match.params.id)
        .then((res: IProjectSetting[]) => {
            this.defaultErrors = res.map((e) => { return {field_spulzeit:"", field_wirkzeit: ""} });
            this.setState({
                settings: res,
                errors: this.defaultErrors,
                showLoader: false,
            });
        });
    }

    componentWillUnmount() {
       this.props.changeTitle(null);
    }

    inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {

            let settings = this.state.settings.map((setting, i)=>{
            if(i === index)
            {
                if(event.target.name === 'field_wirkzeit') {
                    setting.field_wirkzeit = event.target.value;
                } else if(event.target.name === 'field_spulzeit') {
                    setting.field_spulzeit = event.target.value;
                } else if(event.target.name == 'aktiv') {
                    setting.aktiv = setting.aktiv == ProjectSettingStatus.ACTIVE ? ProjectSettingStatus.INACTIVE : ProjectSettingStatus.ACTIVE;
                }
                return setting;
            }
            else 
            {
                return setting;
            }
        });

        //Set state at the end
        this.setState({
            settings: settings,
        });
    }

    onSubmitHandler = (event: React.FormEvent) =>{
        event.preventDefault();
        this.setState({
            showLoader: true,
        })

        ProjectSetting
        .saveProjectSettings(this.state.settings, this.props.match.params.id)
        .then((res) => {
            this.setState({
                settings: res,
                showLoader: false,
                errors: this.defaultErrors,
                message: "Einstellungen erfolgreich aktualisiert",
                messageClass: 'text-success',
            });
            setTimeout(()=> this.setState({message: "", messageClass:""}), 2000 );
        })
        .catch((error: AxiosError) => {
            
            if (error.response?.status == 422) {
                this.setState({
                    errors: this.defaultErrors
                });
                let error_array = error.response?.data.errors;
                let error_keys = Object.keys(error_array);
                for(let key of error_keys)
                {
                    let field = key.split(".")[1];
                    let index = parseInt(key.split(".")[0]);
                    console.log(field);
                    if(field == 'field_spulzeit')
                    {
                        this.setState({
                            errors:{...this.state.errors, [index]:{...this.state.errors[index], field_spulzeit: error_array[key][0]}}
                        });
                    }
                    else if(field == 'field_wirkzeit')
                    {
                        this.setState({
                            errors:{...this.state.errors, [index]:{...this.state.errors[index], field_wirkzeit: error_array[key][0]}}
                        });
                    }
                }
            }
            this.setState({
                showLoader: false,
                message: 'Etwas ist schief gelaufen',
                messageClass: 'text-danger'
            });
            setTimeout(()=> this.setState({message: "", messageClass:""}), 2000 );
        });
    }
    
    render() {
        return (
            <div className="container"> 
                <ProjectForm project={this.state.project as IProject}/>
                <div className="start-form">
                    <div className="form-setting-option mt-4">
                        <h4 className="setting-tittle pl-4">Einstellung</h4>
                        <hr/>
                        <form onSubmit={this.onSubmitHandler}>
                        <div className="main-table table-responsive">
                                <table className="table settings-table">
                                    <caption><span className={this.state.messageClass}>{this.state.message}</span></caption>
                                    <thead>
                                        <tr>
                                        <th scope="col" className="text-left">Name</th>
                                        <th scope="col">Wirkzeit</th>
                                        <th scope="col">Spulzeit</th>
                                        <th scope="col">Aktiv?</th>
                                        </tr>
                                    </thead>
                                    {
                                        this.state.showLoader ? <LoaderBar/> :
                                        <tbody>
                                            {
                                                    this.state.settings.map((setting, index) => {
                                                        return(
                                                            <Fragment key={setting.id}>
                                                            <tr >
                                                                <th scope="row" className="text-left">{setting.field_name}</th>
                                                                <td>
                                                                    <input 
                                                                        type="text"
                                                                        className={`form-control ${this.state.errors[index].field_wirkzeit ? 'is-invalid' : ''}`}
                                                                        value={setting.field_wirkzeit}
                                                                        name='field_wirkzeit'
                                                                        id={`field_name-${setting.id}`}
                                                                        onChange={(e) => this.inputChangeHandler(e, index)}
                                                                    />
                                                                    { this.state.errors[index].field_wirkzeit ? <span className='text-danger'>{this.state.errors[index].field_wirkzeit}</span> : ""}
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                            type="text"
                                                                            className={`form-control ${this.state.errors[index].field_spulzeit ? 'is-invalid' : ''}`}
                                                                            value={setting.field_spulzeit}
                                                                            name='field_spulzeit'
                                                                            onChange={(e) => this.inputChangeHandler(e, index)}
                                                                    />
                                                                    { this.state.errors[index].field_spulzeit ? <span className='text-danger'>{this.state.errors[index].field_spulzeit}</span> : ""}
                                                                </td>
                                                                <td><label className="table-custom-checkbox">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={setting.aktiv == ProjectSettingStatus.ACTIVE}
                                                                        name='aktiv'
                                                                        onChange={(e) => this.inputChangeHandler(e, index)}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                    </label>
                                                                </td>
                                                            </tr>   
                                                            </Fragment>  
                                                        )
                                                    })
                                                }                                                                         
                                        </tbody>
                                    }
                                </table>                   
                        </div>
                        <div className="table-btn text-right my-4">
                            <button type="submit" className="main-btn">Sparen</button>
                        </div>
                        </form> 
                    </div>
                  
            </div>
        </div>
        );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectSettings));
