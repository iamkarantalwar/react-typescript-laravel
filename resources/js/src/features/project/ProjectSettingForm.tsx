import React, { Component, Fragment } from 'react';
import { IProject } from '../../app/models/project.model';
import { ProjectSetting, Project } from '../../app/api/agent';
import { IProjectSetting,  ProjectSettingStatus} from '../../app/models/project-setting.model';
import { connect } from 'react-redux';
import { RootState, changeTitle } from '../../redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import { withTranslation, WithTranslation } from 'react-i18next';


interface MatchParams {
    id: string;
    settingId?: string;
}

const mapStateToProps = (state: RootState) => ({
    title: state.title,
});

const mapDispatchToProps = { changeTitle };

type ReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface IProps extends ReduxProps, RouteComponentProps<MatchParams>, WithTranslation{ }

interface IState {
    project?: IProject;
    setting: IProjectSetting;
    showLoader: boolean,
    message: string,
    messageClass: string
}

class ProjectSettingForm extends Component<IProps, IState> {

    defaultState :IState = {
        setting: {
            aktiv: ProjectSettingStatus.ACTIVE,
            field_name: '',
            field_wirkzeit: '',
            field_spulzeit: '',
            project_id: parseInt(this.props.match.params.id),
        },
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
        });

        if(this.props.match.params.settingId) {
            ProjectSetting.getProjectSetting(this.props.match.params.settingId)
            .then((setting) => this.setState({setting: setting}))
            .catch((err) => alert('Something went wrong. Try again later.'));
        }

    }

    componentWillUnmount() {
       this.props.changeTitle(null);
    }


    onSubmitHandler = (event: React.FormEvent) =>{
        event.preventDefault();
        this.setState({
            showLoader: true,
        });

        if(!this.state.setting.id) {
            ProjectSetting.createProjectSetting(this.state.setting)
            .then(res => {
                alert(this.props.t('Setting Added Successfully'));
                this.props.history.push(`/project/${this.props.match.params.id}/settings`)
            })
            .catch(err => alert(this.props.t('swr')));
        } else {
            ProjectSetting.updateProjectSetting(this.state.setting)
            .then(res => {
                alert('Setting Updated Successfully');
                this.props.history.push(`/project/${this.props.match.params.id}/settings`)
            })
            .catch(err => alert(this.props.t('swr')));
        }

    }


    render() {
        const t = this.props.t;
        return (
            <div className="container">
                <ProjectForm project={this.state.project as IProject}/>
                <div className="start-form">
                    <div className="form-setting-option mt-4">
                        <h4 className="ml-4">{t(this.state.setting.id ? 'Edit' : 'Create')} {t('Product')}</h4>
                        <hr/>
                        <form onSubmit={this.onSubmitHandler.bind(this)}>
                            <div className="col-md-12 mt-4">
                                <div className="row align-items-center">
                                    <div className="col-md-9 col-lg-10">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">{t('Product')} Name</label>
                                            <input
                                                type="name"
                                                className="form-control"
                                                placeholder={t('Product') + " name"}
                                                onChange={(e) => this.setState({ setting: { ...this.state.setting, field_name: e.target.value}})}
                                                value={this.state.setting.field_name}
                                            />
                                        </div>
                                        {
                                            this.state.message ? <span className={`text-${this.state.messageClass}`}>{this.state.message}</span> : null
                                        }
                                    </div>
                                    <div className="col-md-3 col-lg-2">
                                        <div className="form-btn text-right mt-3">
                                            <button type="submit" style={{height:'43px'}} className="main-btn">{t(this.state.setting.id ? 'Update' : 'Add')}  {t('Product')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectSettingForm)));
