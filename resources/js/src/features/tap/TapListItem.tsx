import React, { Component, Fragment } from 'react';
import { ITap } from '../../app/models/tap.model';
import { IProjectSetting, ProjectSettingStatus } from '../../app/models/project-setting.model';
import { ProjectSetting, TapStatic } from '../../app/api/agent';
import { withRouter, RouteComponentProps } from 'react-router';
import { ITapStatic } from '../../app/models/tap-static.model';
import { TapStaticStateEnum } from './TapStaticStateEnum';
import LoaderBar from '../../app/common/LoaderBar';
import { RootState } from '../../redux';
import { connect } from 'react-redux';

interface RouteParam {
    id: string;
}
const mapStateToProps = (state: RootState) => ({
    projectSettings: state.projectSettings,
});

type ReduxProps = ReturnType<typeof mapStateToProps>;

interface IProps extends ReduxProps,RouteComponentProps<RouteParam> {
    tap: ITap;
}

interface IState {
    settings: IProjectSetting[];
    tapStatics: ITapStatic[];
    pendingStatics: IProjectSetting[];
    tapStaticState?: TapStaticStateEnum;
    selectedPendingTapId?: number;
    tapStatus: JSX.Element | undefined;
}

class TapListItem extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            pendingStatics: [],
            settings: [],
            tapStatics: [],
            tapStaticState: undefined,
            selectedPendingTapId: undefined,
            tapStatus: undefined,
        }
    }
    

    componentDidMount() {
        const projectId = this.props.match.params.id;
        const settings = this.props.projectSettings.projectSettings.filter((setting)=> setting.aktiv == ProjectSettingStatus.ACTIVE);
        this.setState({settings: settings});
        TapStatic
        .getTapStatics(this.props.tap.id)
        .then((tapsStatics) => { 
            const pendingStatics = settings.filter((setting) => !tapsStatics.some((tapStatic) => tapStatic.project_setting_id == setting.id));
            this.setState({ 
                tapStatics: tapsStatics,
                pendingStatics: pendingStatics,
            });
            this.checkTapStaticState(settings, pendingStatics);                
        });           
    }

    checkTapStaticState = (settings = this.state.settings, pendingStatics = this.state.pendingStatics) => {
        console.log(this.state);
        let tapStaticState: TapStaticStateEnum | undefined;
        if(pendingStatics.length == settings.length) {
            tapStaticState = TapStaticStateEnum.PENDING;
            this.setState({selectedPendingTapId: pendingStatics[0]?.id});
            this.showPendingTap(pendingStatics[0]?.id);
        } else if(pendingStatics.length>0) {
            !this.state.selectedPendingTapId ? this.setState({selectedPendingTapId: pendingStatics[0]?.id}) : "";
            this.showPendingTap(pendingStatics[0]?.id);
            tapStaticState = TapStaticStateEnum.IPROGRESS;
        } else if(pendingStatics.length === 0) {
            this.showCompletedTap();
            tapStaticState = TapStaticStateEnum.COMPLETED;
        }
        this.setState({ tapStaticState: tapStaticState});
    }

    showCompletedTap = () =>{
        this.setState({tapStatus: <div></div>});
    }

    showInProgressTap = () => {
        const now = new Date();
        const time = now.getHours() + ":" + now.getMinutes();
        const date = now.getDate() + "/" + (now.getMonth()+1) + "/" + now.getFullYear();
        
        const progressTap: JSX.Element = <div className="row">
                                            <div className="col-md-4">
                                                {date}
                                            </div>
                                            <div className="col-md-4">
                                                {time}
                                            </div>
                                         </div>;
        this.setState({tapStatus: progressTap, tapStaticState: TapStaticStateEnum.DETECTING});
    }

    notDetected = (setting: IProjectSetting) => {
        this.tapStaticAgent(setting, false);
        const pendingStatics = this.state.pendingStatics.filter((stat) => stat.id != setting.id);
        this.setState({pendingStatics: pendingStatics, selectedPendingTapId: pendingStatics[0]?.id});
        this.checkTapStaticState(this.state.settings, pendingStatics);
    }

    detected = (setting: IProjectSetting) => {
        let time: string = "";
        //Extract the numeric value from the Field Wirzekut
        for(let i of setting.field_wirkzeit) {
            if(!isNaN(Number(i))) {
                time+=i;
            } 
        }

        //Check if the Field Wirzekut have valid Value 
        if(isNaN(Number(time))) {
            alert('Ask Admin to set timer.');
        } else {
            this.showInProgressTap();
            setTimeout(() => {
                this.tapStaticAgent(setting, true);
                const pendingStatics = this.state.pendingStatics.filter((stat) => stat.id != setting.id);
                this.setState({pendingStatics: pendingStatics, selectedPendingTapId: pendingStatics[0]?.id});
                this.checkTapStaticState();
            }, parseInt(time)*1000);
        }
    }

    tapStaticAgent = (setting: IProjectSetting, detected: boolean) => {
        let tapStatic: ITapStatic = {
            detected:detected,
            project_setting_id: setting?.id as number,
            taps_id: this.props.tap.id,
        }

        TapStatic
        .createTapStatic(tapStatic)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
    }

    tapItemBackgroundClass = () => {
        if (this.state.tapStaticState == TapStaticStateEnum.COMPLETED) {
            return 'bg-success';
        } else if(this.state.tapStaticState == TapStaticStateEnum.IPROGRESS) {
            return 'bg-warning';
        } else if(this.state.tapStaticState == TapStaticStateEnum.DETECTING) {
            return 'bg-danger';
        } else {
            return 'bg-default';
        }
    }

    showPendingTap = (id = this.state.selectedPendingTapId) => {
        let setting = this.state.pendingStatics.find((stat)=> stat.id == id) as IProjectSetting;
        this.setState({tapStatus: <div className="row">
                    <div className="col-md-6">
                        {setting.field_name} Detected
                    </div> 
                    <div className="col-md-6">
                        <i className="fa fa-check mr-3" onClick={(e) => this.detected(setting)}></i>
                        <i className="fa fa-times mr-3" onClick={(e) => this.notDetected(setting)}></i>
                    </div> 
                </div>});
    }

    componentDidUpdate() {
        // console.log(this.state.tapStaticState);
    }

    render() {
        return (
            <div id=""  className="tap-card card-body pr-0 pt-2" data-parent="#accordion" style={{padding: '0 2rem !important'}}>
                <div id="accordion-inner-rooms" className="accordion-inner-rooms">
                    <div className="card mb-0 border-0">
                    <div className={`card-header ${this.tapItemBackgroundClass()} mb-1`} data-toggle="collapse" >
                        <div className="main-room-overview d-flex justify-content-between">
                            <div className="overview-floor-list w-100">
                                <div className="row">
                                    <div className="col-md-4">
                                        {this.props.tap.name}
                                    </div>
                                    <div className="col-md-6">
                                        {
                                            this.state.tapStatus ? this.state.tapStatus : 'Loading.....' 
                                        }
                                    </div>
                                    <div className="col-md-2">
                                        
                                    </div>
                                </div>                      
                            </div>     
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(TapListItem));
